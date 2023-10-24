import { useQuery } from "@tanstack/react-query";
import { type Label } from "../types/label";

export function useLabelsQuery() {
  const labelsQuery = useQuery<Label[], Error>({
    queryKey: ["labels"],
    queryFn: () => fetch(`/api/labels`).then((res) => res.json()),
  });

  return labelsQuery;
}
