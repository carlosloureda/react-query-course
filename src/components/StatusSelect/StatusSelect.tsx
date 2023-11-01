import React from "react";
import { POSSIBLE_STATUSES } from "../../data/status";

type StatusSelectProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  noEmptyOption?: boolean;
};

export function StatusSelect({
  value,
  onChange,
  noEmptyOption = false,
}: StatusSelectProps) {
  return (
    <select value={value} onChange={onChange} className="status-select">
      {noEmptyOption ? null : (
        <option value="">Select a status to filter</option>
      )}
      {POSSIBLE_STATUSES.map((status) => (
        <option value={status.id} key={status.id}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
