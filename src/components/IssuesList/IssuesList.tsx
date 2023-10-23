import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { IssueItem } from "../IssueItem";
import { type Issues } from "../../types/issues";

export function IssuesList() {
  const issuesQuery = useQuery<Issues[], Error>({
    queryKey: ["issues"],
    queryFn: () => fetch("/api/issues").then((res) => res.json()),
  });

  if (issuesQuery.data) {
    const a = issuesQuery.data;
  }

  return (
    <div>
      <h2>Issues List</h2>
      {issuesQuery.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <ul className="issues-list">
          {issuesQuery?.data?.map((issue) => (
            <IssueItem
              key={issue.id}
              title={issue.title}
              number={issue.number}
              assignee={issue.assignee}
              commentCount={issue.comments.length}
              createdBy={issue.createdBy}
              createdDate={issue.createdDate}
              labels={issue.labels}
              status={issue.status}
            />
          ))}
          <li>
            <Link to="/issue/1">Issue 1</Link>
          </li>
        </ul>
      )}
    </div>
  );
}
