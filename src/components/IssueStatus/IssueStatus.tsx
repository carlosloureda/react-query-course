import React from "react";
import { StatusSelect } from "../StatusSelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Issue } from "../../types/issue";

type IssueStatusProps = {
  status: string;
  issueNumber: string;
};

export function IssueStatus({ status, issueNumber }: IssueStatusProps) {
  const queryClient = useQueryClient();
  const setStatus = useMutation({
    mutationFn: (status: string) =>
      fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status }),
      }).then((res) => res.json()),
    onMutate: (status: string) => {
      const oldStatus = queryClient.getQueryData<Issue>([
        "issues",
        issueNumber,
      ])?.status;
      // Update the 'status' and the issue detail info
      queryClient.setQueryData(["issues", issueNumber], (data: Issue) => ({
        ...data,
        status,
      }));

      return function rollback() {
        queryClient.setQueryData(["issues", issueNumber], (data: Issue) => ({
          ...data,
          status: oldStatus,
        }));
      };
    },
    onError: (error: Error, variables: string, context) => {
      console.log(
        `[IssueStatus setStatus] error on mutation: ${error.message}, variables: ${variables}`
      );
      context?.();
    },
    onSuccess: (data: Issue, variables: string, context) => {
      // if it was succesful we want do an update as if they do lot of updates in the same time
      // the UI wouldn't be great. if we wanted to do so we should do the following:
      /* context?.();
      queryClient.setQueryData(["issues", issueNumber], data);
      */
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["issues", issueNumber],
        exact: true,
      });
    },
  });
  return (
    <div className="issue-options">
      <div>
        <span>Status</span>
        <StatusSelect
          noEmptyOption
          value={status}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setStatus.mutate(event.target.value)
          }
        />
      </div>
    </div>
  );
}
