import { useQuery } from "@tanstack/react-query";
import { Issue } from "./../../../types/issue";

export function useIssueQuery({ issueNumber }: { issueNumber?: string }) {
  return useQuery<Issue>({
    queryKey: ["issues", issueNumber],
    queryFn: async ({ signal }) => {
      return fetch(`/api/issues/${issueNumber}`, { signal }).then((res) =>
        res.json()
      );
    },
    enabled: !!issueNumber,
  });
}
