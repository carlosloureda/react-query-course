import React from "react";
import { useUserQuery } from "../../../../hooks/useUserQuery";
import { relativeDate } from "../../../../helpers/relativeDate";

type CommentProps = {
  comment: string;
  createdBy: string;
  createdDate: string;
};

export function Comment({ comment, createdBy, createdDate }: CommentProps) {
  const userQuery = useUserQuery(createdBy);

  if (userQuery.isLoading)
    return (
      <div className="comment">
        <div>
          <div className="comment-header">Loading...</div>
        </div>
      </div>
    );

  return (
    <div className="comment">
      <img src={userQuery.data?.profilePictureUrl} alt="Commenter Avatar" />
      <div>
        <div className="comment-header">
          <span>{userQuery.data?.name}</span> commented{" "}
          <span>{relativeDate(createdDate)}</span>
        </div>
        <div className="comment-body">{comment}</div>
      </div>
    </div>
  );
}
