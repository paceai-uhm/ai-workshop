import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, completed")
    .order("created_at", { ascending: true });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span>{user.email}</span>
        <LogoutButton />
      </header>
      <main>
        <TaskList userId={user.id} initialTasks={tasks ?? []} />
      </main>
    </div>
  );
}
