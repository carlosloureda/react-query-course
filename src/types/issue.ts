export interface Issue {
  id: string;
  title: string;
  labels: string[];
  comments: string[];
  number: number;
  status: string;
  // TODO: check dates format properly
  createdDate: string;
  createdBy: string;
  assignee: string | null;
  dueDate: string | null;
  completedDate: string | null;
}
