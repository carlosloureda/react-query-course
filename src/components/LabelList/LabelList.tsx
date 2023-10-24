import React from "react";
import { useLabelsQuery } from "../../hooks/useLabelQuery";

type LabelListProp = {
  selected: string[];
  toggle: (label: string) => void;
};

export function LabelList({ selected, toggle }: LabelListProp) {
  const labelsQuery = useLabelsQuery();

  return (
    <div className="labels">
      <h3>Labels</h3>
      {labelsQuery.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <ul>
          {labelsQuery.data?.map((label) => (
            <li key={label.id}>
              <button
                onClick={() => toggle(label.name)}
                className={`label ${
                  selected.includes(label.name) ? "selected" : ""
                } ${label.color}`}
              >
                {label.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
