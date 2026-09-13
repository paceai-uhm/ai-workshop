"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./task-list.module.css";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function TaskList({
  userId,
  initialTasks,
}: {
  userId: string;
  initialTasks: Task[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert({ title: trimmed, user_id: userId })
      .select("id, title, completed")
      .single();

    setSubmitting(false);

    if (insertError || !data) {
      setError(insertError?.message ?? "Could not add task.");
      return;
    }

    setTasks((prev) => [...prev, data]);
    setTitle("");
  }

  async function toggleTask(id: string, completed: boolean) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed } : task)),
    );

    const supabase = createClient();
    await supabase.from("tasks").update({ completed }).eq("id", id);
  }

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Add a task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button className={styles.button} type="submit" disabled={submitting}>
          Add
        </button>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tasks</h2>
        {activeTasks.length === 0 ? (
          <p className={styles.empty}>No tasks yet.</p>
        ) : (
          <ul className={styles.list}>
            {activeTasks.map((task) => (
              <li className={styles.item} key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(event) =>
                    toggleTask(task.id, event.target.checked)
                  }
                />
                <span>{task.title}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {completedTasks.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Completed</h2>
          <ul className={styles.list}>
            {completedTasks.map((task) => (
              <li className={styles.item} key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(event) =>
                    toggleTask(task.id, event.target.checked)
                  }
                />
                <span className={styles.completedText}>{task.title}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
