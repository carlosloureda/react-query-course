import React from "react";
import { useLabelsQuery } from "../../../../hooks/useLabelQuery";

export function Label({ labelId }: { labelId: string }) {
  const labelsQuery = useLabelsQuery();

  if (labelsQuery.isLoading) return null;

  const label = labelsQuery.data?.find(
    (queryLabel) => queryLabel.id === labelId
  );

  if (!label) return null;

  return (
    <span key={label.id} className={`label ${label.color}`}>
      {label.name}
    </span>
  );
}
