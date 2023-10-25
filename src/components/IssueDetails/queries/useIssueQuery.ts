import { useQuery } from "@tanstack/react-query";

export function useIssueQuery({ issueNumber }: { issueNumber?: string }) {
  return useQuery({
    queryKey: ["issues", issueNumber],
    queryFn: async () => {
      return fetch(`/api/issues/${issueNumber}`).then((res) => res.json());
    },
    enabled: !!issueNumber,
  });
}
