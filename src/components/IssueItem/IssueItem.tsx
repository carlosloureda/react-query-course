import React from "react";
import { Link } from "react-router-dom";
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";
import { relativeDate } from "../../helpers/relativeDate";
import { useUserQuery } from "../../hooks/useUserQuery";

type IssueItemProps = {
  title: string;
  number: number;
  assignee: string | null;
  commentCount: number;
  createdBy: string;
  createdDate: string;
  labels: string[];
  status: string;
};

export function IssueItem({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status,
}: IssueItemProps) {
  const assigneeQuery = useUserQuery(assignee);
  const createdByQuery = useUserQuery(createdBy);
  return (
    <li>
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed style={{ color: "red" }} />
        ) : (
          <GoIssueOpened style={{ color: "green" }} />
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issue/${number}`}>{title}</Link>
          {labels.map((label) => (
            <span key={label} className={`label red`}>
              {label}
            </span>
          ))}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)} by &nbsp;
          {createdByQuery.isSuccess ? createdByQuery.data.name : "..."}
        </small>
      </div>
      {assignee && assigneeQuery.isSuccess ? (
        <img
          src={assigneeQuery.data.profilePictureUrl}
          alt={`Assigned to ${
            assigneeQuery.data?.profilePictureUrl ?? "Avatar"
          }`}
          className="assigned-to"
        />
      ) : null}
      <span className="comment-count">
        {commentCount > 0 ? (
          <>
            <GoComment />
            {commentCount}
          </>
        ) : null}
      </span>
    </li>
  );
}
