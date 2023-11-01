import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { GoGear } from "react-icons/go";
import { type User } from "../../types/user";
import { type Issue } from "../../types/issue";
import { useUserQuery } from "../../hooks/useUserQuery";

type IssueAssignmentProps = {
  assignee: string;
  issueNumber: string;
};
export function IssueAssignment({
  assignee,
  issueNumber,
}: IssueAssignmentProps) {
  const userQuery = useUserQuery(assignee);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => fetch(`/api/users`).then((res) => res.json()),
  });

  const setAssignee = useMutation({
    mutationFn: (assignee: number) =>
      fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ assignee }),
      }).then((res) => res.json()),
    onMutate: (assignee: number) => {
      const oldAssignee = queryClient.getQueryData<Issue>([
        "issues",
        issueNumber,
      ])?.assignee;
      // Update the 'assignee' and the issue detail info
      queryClient.setQueryData(["issues", issueNumber], (data: Issue) => ({
        ...data,
        assignee,
      }));

      return function rollback() {
        queryClient.setQueryData(["issues", issueNumber], (data: Issue) => ({
          ...data,
          assignee: oldAssignee,
        }));
      };
    },
    onError: (error: Error, variables: number, context) => {
      console.log(
        `[IssueAssignment setAssignee] error on mutation: ${error.message}, variables: ${variables}`
      );
      context?.();
    },
    onSuccess: (data: Issue, variables: number, context) => {
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
        <span>Assignment</span>
        {userQuery.isSuccess && (
          <div>
            <img
              src={userQuery.data.profilePictureUrl}
              alt={`Avatar for ${userQuery.data.name}`}
            />
            {userQuery.data.name}
          </div>
        )}
      </div>
      <GoGear
        onClick={() => !usersQuery.isLoading && setMenuIsOpen((open) => !open)}
      />

      {menuIsOpen && (
        <div className="picker-menu">
          {usersQuery.data?.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                setAssignee.mutate(user.id);
                setMenuIsOpen(false);
              }}
            >
              <img
                src={user.profilePictureUrl}
                alt={`Avatar for ${user.name}`}
              />
              {user.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
