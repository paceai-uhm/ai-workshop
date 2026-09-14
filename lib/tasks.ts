import { daysBetween } from "./dates";

export type Task = {
  id: string;
  title: string;
  title_ja: string | null;
  completed: boolean;
  due_date: string | null;
  created_at: string;
};

/** The columns every query of this table selects. */
export const TASK_COLUMNS = "id, title, title_ja, completed, due_date, created_at";

export type TaskGroup = {
  key: "overdue" | "today" | "later" | "completed";
  heading: string;
  tasks: Task[];
};

/**
 * Split tasks into the sections the list renders, in display order.
 *
 * A completed task leaves the date sections entirely, however it was dated:
 * once it is checked off, "overdue" is no longer a useful thing to say about
 * it. A task with no due date is neither overdue nor due today, so it sorts
 * to the end of "Later".
 */
export function groupTasks(tasks: Task[], today: string): TaskGroup[] {
  const overdue: Task[] = [];
  const dueToday: Task[] = [];
  const later: Task[] = [];
  const completed: Task[] = [];

  for (const task of tasks) {
    if (task.completed) completed.push(task);
    else if (task.due_date === null) later.push(task);
    // Zero-padded ISO dates compare correctly as plain strings.
    else if (task.due_date < today) overdue.push(task);
    else if (task.due_date === today) dueToday.push(task);
    else later.push(task);
  }

  const byDueDateThenCreated = (a: Task, b: Task) => {
    // Undated tasks sink below dated ones inside "Later".
    if (a.due_date === null && b.due_date !== null) return 1;
    if (a.due_date !== null && b.due_date === null) return -1;
    if (a.due_date !== null && b.due_date !== null && a.due_date !== b.due_date) {
      return a.due_date < b.due_date ? -1 : 1;
    }
    return a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0;
  };

  overdue.sort(byDueDateThenCreated);
  dueToday.sort(byDueDateThenCreated);
  later.sort(byDueDateThenCreated);
  completed.sort(byDueDateThenCreated);

  return [
    { key: "overdue", heading: "Overdue", tasks: overdue },
    { key: "today", heading: "Due today", tasks: dueToday },
    { key: "later", heading: "Later", tasks: later },
    { key: "completed", heading: "Completed", tasks: completed },
  ];
}

/** How many days late a task is, for the red date text. 0 if not overdue. */
export function daysOverdue(task: Task, today: string): number {
  if (task.completed || task.due_date === null || task.due_date >= today) return 0;
  return -daysBetween(today, task.due_date);
}

/** A task can be quizzed only if it has both languages to choose between. */
export function isBilingual(task: Task): boolean {
  return task.title_ja !== null && task.title_ja.trim() !== "";
}
