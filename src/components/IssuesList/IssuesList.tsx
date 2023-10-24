import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { IssueItem } from "../IssueItem";
import { type Issue } from "../../types/issue";

type IssuesListProps = {
  labels: string[];
  status: string;
};

export function IssuesList({ labels, status }: IssuesListProps) {
  const issuesQuery = useQuery<Issue[], Error>({
    queryKey: ["issues", { labels, status }],
    queryFn: () => {
      const statusString = status ? `&status=${status}` : "";
      const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
      return fetch(`/api/issues?${labelsString}${statusString}`).then((res) =>
        res.json()
      );

      // const params = new URLSearchParams();
      // status && params.append("status", status);
      // labels.forEach((label) => params.append("labels[]", label));
      // return fetch(`/api/issues?${params.toString()}`).then((res) =>
      //   res.json()
      // );
    },
  });

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
        </ul>
      )}
    </div>
  );
}
