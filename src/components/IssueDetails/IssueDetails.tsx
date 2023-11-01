import React from "react";
import { useParams } from "react-router-dom";
import { useIssueQuery } from "./queries/useIssueQuery";
import { useIssueCommentsQuery } from "./queries/useIssueCommentsQuery";
import { IssueHeader } from "./components/IssueHeader";
import { Comment } from "./components/Comment";
import { IssueStatus } from "../IssueStatus/IssueStatus";

export function IssueDetails() {
  const { number } = useParams();
  const issueQuery = useIssueQuery({ issueNumber: number });
  const commentsQuery = useIssueCommentsQuery({ issueNumber: number });

  return (
    <div className="issue-details">
      {issueQuery.isLoading ? (
        <p>Loading issue...</p>
      ) : (
        <>
          <IssueHeader {...issueQuery.data} />
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
              <IssueStatus
                status={issueQuery.data.status}
                issueNumber={issueQuery.data.number.toString()}
              />
            </aside>
          </main>
        </>
      )}
    </div>
  );
}
