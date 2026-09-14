import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { todayInAppZone } from "@/lib/dates";
import { TASK_COLUMNS, type Task } from "@/lib/tasks";
import LogoutButton from "./logout-button";
import TaskList from "./task-list";
import styles from "./page.module.css";

export default async function TasksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // RLS restricts this to the signed-in account's rows; there is deliberately
  // no .eq("user_id", ...) here, because the database is what enforces it.
  const { data: tasks } = await supabase
    .from("tasks")
    .select(TASK_COLUMNS)
    .order("created_at", { ascending: true });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span>{user.email}</span>
        <LogoutButton />
      </header>
      <main>
        <TaskList
          userId={user.id}
          initialTasks={(tasks as Task[] | null) ?? []}
          today={todayInAppZone()}
        />
      </main>
    </div>
  );
}
