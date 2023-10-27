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
    staleTime: 1000 * 60,
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

  const showIssuesSearch =
    !issuesQuery.isLoading &&
    (searchQuery.isLoading || searchQuery.status !== "pending");

  const renderIssueItemsList = ({ items }: { items?: Issue[] }) => {
    return (
      <ul className="issues-list">
        {items?.map((issue) => (
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
    );
  };

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
      {!showIssuesSearch && (
        <>
          <h2>Issues List</h2>
          {issuesQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            renderIssueItemsList({ items: issuesQuery.data })
          )}
        </>
      )}
      {showIssuesSearch && (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchQuery.data?.count} Results</p>
              {renderIssueItemsList({ items: searchQuery.data?.items })}
            </>
          )}
        </>
      )}
    </div>
  );
}
