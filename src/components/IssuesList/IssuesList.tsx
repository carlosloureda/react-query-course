import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const [searchValue, setSearchValue] = useState("");

  const searchQuery = useQuery<
    {
      count: number;
      items: Issue[];
    },
    Error
  >({
    queryKey: ["issues", "search", searchValue],
    queryFn: () =>
      fetch(`/api/search/issues?q=${searchValue}`).then((res) => res.json()),
    enabled: searchValue.length > 0,
  });

  return (
    <div>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const form = event.target as HTMLFormElement;
          setSearchValue(
            (form.elements.namedItem("search") as HTMLInputElement).value
          );
        }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="Search"
          name="search"
          id="search"
          onChange={(event) => {
            if (event.target.value.length === 0) {
              setSearchValue("");
            }
          }}
        />
      </form>
      {issuesQuery.isLoading ? (
        <>
          <h2>Issues List</h2>
          <p>Loading...</p>
        </>
      ) : searchQuery.status === "pending" && !searchQuery.isLoading ? (
        <>
          <h2>Issues List</h2>
          <ul className="issues-list">
            {issuesQuery.data?.map((issue) => (
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
        </>
      ) : (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchQuery.data?.count} Results</p>
              <ul className="issues-list">
                {searchQuery.data?.items.map((issue) => (
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
            </>
          )}
        </>
      )}
    </div>
  );
}
