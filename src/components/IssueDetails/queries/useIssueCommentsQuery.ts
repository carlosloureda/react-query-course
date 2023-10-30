import { useQuery } from "@tanstack/react-query";
import { Comment } from "../../../types/comment";

export function useIssueCommentsQuery({
  issueNumber,
}: {
  issueNumber?: string;
}) {
  return useQuery<Comment[], Error>({
    queryKey: ["issues", issueNumber, "comments"],
    queryFn: async ({ signal }) => {
      return fetch(`/api/issues/${issueNumber}/comments`, { signal }).then(
        (res) => res.json()
      );
    },
    enabled: !!issueNumber,
  });
}
