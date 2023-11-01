import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLabelsQuery } from "../../hooks/useLabelQuery";
import { GoGear } from "react-icons/go";
import { useState } from "react";
import { type Issue } from "../../types/issue";

type IssueLabelsProps = {
  labelsIds: string[] | null;
  issueNumber: string;
};
export default function IssueLabels({
  labelsIds,
  issueNumber,
}: IssueLabelsProps) {
  const labelsQuery = useLabelsQuery();
  const [menuOpen, setMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const setLabels = useMutation({
    mutationFn: (labelId: string) => {
      const newLabels = labelsIds?.includes(labelId)
        ? labelsIds.filter((currentLabel) => currentLabel !== labelId)
        : [...(labelsIds || []), labelId];
      return fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ labels: newLabels }),
      }).then((res) => res.json());
    },
    onMutate: (labelId: string) => {
      const oldLabels = queryClient.getQueryData<Issue>([
        "issues",
        issueNumber,
      ])?.labels;
      const newLabels = oldLabels?.includes(labelId)
        ? oldLabels.filter((label) => label !== labelId)
        : oldLabels
        ? [...oldLabels, labelId]
        : [labelId];

      queryClient.setQueryData(["issues", issueNumber], (data: Issue) => ({
        ...data,
        labels: newLabels,
      }));
      return function rollback() {
        queryClient.setQueryData(["issues", issueNumber], (data: Issue) => {
          const rollbackLabels = oldLabels?.includes(labelId)
            ? [...data.labels, labelId]
            : data.labels.filter((label) => label !== labelId);
          return {
            ...data,
            labels: rollbackLabels,
          };
        });
      };
    },
    onError: (error, variables, context) => {
      console.log(
        `[IssueLabels setLabels] error on mutation: ${error.message}, variables: ${variables}`
      );
      context?.();
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
        <span>Labels</span>
        {labelsQuery.isLoading
          ? null
          : labelsIds?.map((labelId) => {
              const labelObject = labelsQuery.data?.find(
                (queryLabel) => queryLabel.id === labelId
              );
              if (!labelObject) return null;
              return (
                <span key={labelId} className={`label ${labelObject.color}`}>
                  {labelObject.name}
                </span>
              );
            })}
      </div>
      <GoGear
        onClick={() => !labelsQuery.isLoading && setMenuOpen((open) => !open)}
      />
      {menuOpen && (
        <div className="picker-menu labels">
          {labelsQuery.data?.map((label) => {
            const selected = labelsIds?.includes(label.id);
            return (
              <div
                key={label.id}
                className={selected ? "selected" : ""}
                onClick={() => {
                  setLabels.mutate(label.id);
                  setMenuOpen(false);
                }}
              >
                <span
                  className="label-dot"
                  style={{ backgroundColor: label.color }}
                ></span>
                {label.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
