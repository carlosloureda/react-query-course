import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function AddIssue() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addIssue = useMutation({
    mutationFn: ({ comment, title }: { comment: string; title: string }) =>
      fetch("/api/issues", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ comment, title }),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["issues"], exact: true });
      queryClient.setQueryData(["issues", data.number.toString()], data);
      navigate(`/issue/${data.number}`);
    },
  });
  return (
    <div className="add-issue">
      <h2>Add Issue</h2>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          if (addIssue.isPending) return;

          const target = event.target as typeof event.target & {
            comment: { value: string };
            title: { value: string };
          };

          addIssue.mutate({
            comment: target.comment.value,
            title: target.title.value,
          });
        }}
      >
        <label htmlFor="title">Title</label>
        <input type="text" id="title" placeholder="Title" name="title" />
        <label htmlFor="comment">Comment</label>
        <textarea placeholder="Comment" id="comment" name="comment" />
        <button type="submit" disabled={addIssue.isPending}>
          {addIssue.isPending ? "Adding Issue..." : "Add Issue"}
        </button>
      </form>
    </div>
  );
}
