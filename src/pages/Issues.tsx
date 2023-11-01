import React from "react";
import { IssuesList } from "../components/IssuesList";
import { LabelList } from "../components/LabelList";
import { StatusSelect } from "../components/StatusSelect";
import { Link } from "react-router-dom";

const INITIAL_PAGE_NUM = 1;
export function Issues() {
  const [labels, setLabels] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState("");
  const [pageNum, setPageNum] = React.useState(INITIAL_PAGE_NUM);

  const onLabelToggleHandler = (label: string) => {
    setLabels((currentLabels) => {
      if (currentLabels.includes(label)) {
        return currentLabels.filter((currentLabel) => currentLabel !== label);
      }
      return currentLabels.concat(label);
    });
    setPageNum(INITIAL_PAGE_NUM);
  };

  return (
    <div>
      <main>
        <section>
          <IssuesList
            labels={labels}
            status={status}
            pageNum={pageNum}
            onPageNumChange={(_pageNum: number) => setPageNum(_pageNum)}
          />
        </section>
        <aside>
          <LabelList
            selected={labels}
            toggle={(label: string) => onLabelToggleHandler(label)}
          />
          <h3>Status</h3>
          <StatusSelect
            value={status}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setStatus(event.target.value);
              setPageNum(INITIAL_PAGE_NUM);
            }}
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
