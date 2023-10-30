import { useQuery } from "@tanstack/react-query";
import { type Label } from "../types/label";
import { defaultLabels } from "../data/defaultData";

export function useLabelsQuery() {
  const labelsQuery = useQuery<Label[], Error>({
    queryKey: ["labels"],
    queryFn: ({ signal }) =>
      fetch(`/api/labels`, { signal }).then((res) => res.json()),
    staleTime: 1000 * 60 * 60,
    placeholderData: defaultLabels,
  });

  return labelsQuery;
}
