import React from "react";
import { useParams } from "react-router-dom";
import { useIssueQuery } from "./queries/useIssueQuery";
import { useIssueCommentsQuery } from "./queries/useIssueCommentsQuery";
import { IssueHeader } from "./components/IssueHeader";
import { Comment } from "./components/Comment";
import { IssueStatus } from "../IssueStatus/IssueStatus";
import { IssueAssignment } from "../IssueAssignment";
import IssueLabels from "../Issuelabels/Issuelabels";

export function IssueDetails() {
  const { number } = useParams();
  const issueQuery = useIssueQuery({ issueNumber: number });
  const commentsQuery = useIssueCommentsQuery({ issueNumber: number });

  if (!issueQuery.isLoading && !issueQuery.data) {
    return <p>Error loading data for issue detail</p>;
  }

  return (
    <div className="issue-details">
      {issueQuery.isLoading ? (
        <p>Loading issue...</p>
      ) : (
        <>
          {issueQuery.data && <IssueHeader {...issueQuery.data} />}
          <main>
            <section>
              {commentsQuery.isLoading ? (
                <p>Loading...</p>
              ) : (
                commentsQuery.data?.map((comment) => (
                  <Comment key={comment.id} {...comment} />
                ))
              )}
            </section>
            <aside>
              {issueQuery.data && (
                <>
                  <IssueStatus
                    status={issueQuery.data.status}
                    issueNumber={issueQuery.data.number.toString()}
                  />
                  <IssueAssignment
                    assignee={issueQuery.data.assignee}
                    issueNumber={issueQuery.data.number.toString()}
                  />
                  <IssueLabels
                    labelsIds={issueQuery.data.labels}
                    issueNumber={issueQuery.data.number.toString()}
                  />
                </>
              )}
            </aside>
          </main>
        </>
      )}
    </div>
  );
}
