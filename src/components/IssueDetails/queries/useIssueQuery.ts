import { useQuery } from "@tanstack/react-query";

export function useIssueQuery({ issueNumber }: { issueNumber?: string }) {
  return useQuery({
    queryKey: ["issues", issueNumber],
    queryFn: async ({ signal }) => {
      return fetch(`/api/issues/${issueNumber}`, { signal }).then((res) =>
        res.json()
      );
    },
    enabled: !!issueNumber,
  });
}
