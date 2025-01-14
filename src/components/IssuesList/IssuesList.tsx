import React, { useState } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { IssueItem } from "../IssueItem";
import { type Issue } from "../../types/issue";
import fetchWithError from "../../helpers/fetchWithError";
import { Loader } from "../Loader";

type IssuesListProps = {
  labels: string[];
  status: string;
  pageNum: number;
  onPageNumChange: (_: number) => void;
};

type HeadersInitWithCustomError = HeadersInit & {
  // Custom header so built in API on server fails the 50% of the times
  "x-error": boolean;
};

export function IssuesList({
  labels,
  status,
  pageNum,
  onPageNumChange,
}: IssuesListProps) {
  // Set this to true to test the fetch error (add 50% change query fails and dont retry)
  // for issuesQuery
  const testErrorFetch = false;
  const queryClient = useQueryClient();
  const issuesQuery = useQuery<Issue[], Error>({
    queryKey: ["issues", { labels, status, pageNum }],
    queryFn: async ({ signal }) => {
      const statusString = status ? `&status=${status}` : "";
      const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
      const paginationString = pageNum ? `&page=${pageNum}` : "";
      const results: Issue[] = await fetchWithError(
        `/api/issues?${labelsString}${statusString}${paginationString}`,
        testErrorFetch
          ? {
              headers: {
                "x-error": true,
              } as HeadersInitWithCustomError,
              signal,
            }
          : { signal }
      );
      results.forEach((issue) => {
        queryClient.setQueryData(["issues", issue.number.toString()], issue);
      });

      return results;

      // const params = new URLSearchParams();
      // status && params.append("status", status);
      // labels.forEach((label) => params.append("labels[]", label));
      // return fetch(`/api/issues?${params.toString()}`);
    },
    retry: testErrorFetch ? false : true,
    // Check main.jsx to see how to handle errors in a declarative way
    meta: {
      errorMessage: "Failed to fetch initial issues",
    },
    placeholderData: keepPreviousData,
  });

  // We could also prefetch next issues page like this example: https://codesandbox.io/s/paginated-queries-lk3w69?file=/App.js
  const [searchValue, setSearchValue] = useState("");

  const searchQuery = useQuery<
    {
      count: number;
      items: Issue[];
    },
    Error
  >({
    queryKey: ["issues", "search", searchValue],
    queryFn: ({ signal }) =>
      fetchWithError(`/api/search/issues?q=${searchValue}`, { signal }),
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
          <h2>Issues List {issuesQuery.isFetching ? <Loader /> : null}</h2>
          {issuesQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              {issuesQuery.isError ? (
                <p>{issuesQuery.error.message}</p>
              ) : (
                renderIssueItemsList({ items: issuesQuery.data })
              )}
              <div className="pagination">
                <button
                  onClick={() => {
                    if (pageNum - 1 > 0) {
                      onPageNumChange(pageNum - 1);
                    }
                  }}
                  disabled={pageNum === 1}
                >
                  Previous
                </button>
                <p>
                  page {pageNum} {issuesQuery.isFetching ? "..." : ""}
                </p>
                <button
                  onClick={() => {
                    if (
                      issuesQuery.data?.length !== 0 &&
                      !issuesQuery.isPlaceholderData
                    ) {
                      onPageNumChange(pageNum + 1);
                    }
                  }}
                  disabled={
                    issuesQuery.data?.length === 0 ||
                    issuesQuery.isPlaceholderData
                  }
                >
                  Next
                </button>
              </div>
            </>
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
