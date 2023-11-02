import { useInfiniteQuery } from "@tanstack/react-query";
import { Comment } from "../../../types/comment";

export function useIssueCommentsQuery({
  issueNumber,
}: {
  issueNumber?: string;
}) {
  return useInfiniteQuery<Comment[], Error>({
    queryKey: ["issues", issueNumber, "comments"],
    queryFn: async ({ signal, pageParam }) => {
      return fetch(`/api/issues/${issueNumber}/comments?page=${pageParam}`, {
        signal,
      }).then((res) => res.json());
    },
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: Comment[],
      allPages: Comment[][],
      lastPageParam: unknown
    ) => {
      if (lastPage.length === 0) return 1;
      return (lastPageParam as number) + 1;
    },
    enabled: !!issueNumber,
  });
}
