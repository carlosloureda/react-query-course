import React from "react";
import { GoIssueOpened, GoIssueClosed } from "react-icons/go";
import { POSSIBLE_STATUSES } from "../../../../data/status";
import { useUserQuery } from "../../../../hooks/useUserQuery";
import { relativeDate } from "../../../../helpers/relativeDate";

type IssueHeaderProp = {
  title: string;
  number: string;
  status: string;
  createdBy: string;
  createdDate: string;
  comments: string[];
};

export function IssueHeader({
  title,
  number,
  status = "todo",
  createdBy,
  createdDate,
  comments,
}: IssueHeaderProp) {
  const statusObject = POSSIBLE_STATUSES.find(
    (pstatus) => pstatus.id === status
  );

  const createdUser = useUserQuery(createdBy);

  return (
    <header>
      <h2>
        {title} <span>#{number}</span>
      </h2>

      <div>
        <span
          className={
            status === "done" || status === "cancelled" ? "closed" : "open"
          }
        >
          {status === "done" || status === "cancelled" ? (
            <GoIssueClosed />
          ) : (
            <GoIssueOpened />
          )}
          {statusObject?.label}
        </span>
        <span className="created-by">
          {createdUser.isLoading ? "..." : createdUser.data?.name}
        </span>{" "}
        opened this issue {relativeDate(createdDate)} · {comments.length}{" "}
        comments
      </div>
    </header>
  );
}
