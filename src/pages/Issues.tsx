import React from "react";
import { IssuesList } from "../components/IssuesList";
import { LabelList } from "../components/LabelList";
import { StatusSelect } from "../components/StatusSelect";
import { Link } from "react-router-dom";

export function Issues() {
  const [labels, setLabels] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState("");

  const onLabelToggleHandler = (label: string) => {
    setLabels((currentLabels) => {
      if (currentLabels.includes(label)) {
        return currentLabels.filter((currentLabel) => currentLabel !== label);
      }
      return currentLabels.concat(label);
    });
  };

  return (
    <div>
      <main>
        <section>
          <IssuesList labels={labels} status={status} />
        </section>
        <aside>
          <LabelList
            selected={labels}
            toggle={(label: string) => onLabelToggleHandler(label)}
          />
          <h3>Status</h3>
          <StatusSelect
            value={status}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setStatus(event.target.value)
            }
          />
          <hr />
          <Link className="button" to="/add">
            Add Issue
          </Link>
        </aside>
      </main>
    </div>
  );
}
