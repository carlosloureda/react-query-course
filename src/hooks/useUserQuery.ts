import { useQuery } from "@tanstack/react-query";
import { type User } from "../types/user";

export function useUserQuery(userId: string | null) {
  const userQuery = useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  return userQuery;
}
