import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";
import styles from "./page.module.css";

export default async function TasksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span>{user.email}</span>
        <LogoutButton />
      </header>
      <main>
        <p>Tasks are coming in the next slice.</p>
      </main>
    </div>
  );
}
