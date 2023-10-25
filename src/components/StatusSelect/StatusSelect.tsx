import React from "react";
import { POSSIBLE_STATUSES } from "../../data/status";

type StatusSelectProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <select value={value} onChange={onChange} className="status-select">
      <option value="">Select a status to filter</option>
      {POSSIBLE_STATUSES.map((status) => (
        <option value={status.id} key={status.id}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
