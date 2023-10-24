import { useQuery } from "@tanstack/react-query";
import { User } from "../types/user";

export function useUserQuery(userId: string | null) {
  const userQuery = useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: () => {
      if (!userId) return new Promise((res) => res);

      return fetch(`/api/users/${userId}`).then((res) => res.json());
    },
  });

  return userQuery;
}
