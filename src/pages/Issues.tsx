import React from "react";
import { IssuesList } from "../components/IssuesList";
import { LabelList } from "../components/LabelList";

export function Issues() {
  const [labels, setLabels] = React.useState<string[]>([]);

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
          <h1>Issues</h1>
          <IssuesList labels={labels} />
        </section>
        <aside>
          <LabelList
            selected={labels}
            toggle={(label: string) => onLabelToggleHandler(label)}
          />
        </aside>
      </main>
    </div>
  );
}
