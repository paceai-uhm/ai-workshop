"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDueDate } from "@/lib/dates";
import {
  TASK_COLUMNS,
  daysOverdue,
  groupTasks,
  isBilingual,
  type Task,
} from "@/lib/tasks";
import styles from "./task-list.module.css";

type QuizLang = "en" | "ja";

/**
 * Pick a language per task for one round of quiz mode. A task with no Japanese
 * title has nothing to hide, so it always shows English.
 */
function rollLanguages(tasks: Task[]): Record<string, QuizLang> {
  const rolled: Record<string, QuizLang> = {};
  for (const task of tasks) {
    rolled[task.id] = isBilingual(task) && Math.random() < 0.5 ? "ja" : "en";
  }
  return rolled;
}

export default function TaskList({
  userId,
  initialTasks,
  today,
}: {
  userId: string;
  initialTasks: Task[];
  /**
   * Today's calendar day, decided on the server so that server and client
   * render the same sections and nothing shifts on hydration.
   */
  today: string;
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [titleJa, setTitleJa] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [quizMode, setQuizMode] = useState(false);
  const [quizLang, setQuizLang] = useState<Record<string, QuizLang>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const groups = groupTasks(tasks, today).filter(
    (group) => group.tasks.length > 0,
  );

  function toggleQuizMode() {
    const next = !quizMode;
    setQuizMode(next);
    setRevealed({});
    // Re-roll on every switch-on, so the same list quizzes differently.
    if (next) setQuizLang(rollLanguages(tasks));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedJa = titleJa.trim();
    if (!trimmedTitle) {
      setError("An English title is required.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert({
        title: trimmedTitle,
        title_ja: trimmedJa || null,
        due_date: dueDate || null,
        user_id: userId,
      })
      .select(TASK_COLUMNS)
      .single();

    setSubmitting(false);

    if (insertError || !data) {
      setError(insertError?.message ?? "Could not add task.");
      return;
    }

    const created = data as Task;
    setTasks((prev) => [...prev, created]);
    if (quizMode) {
      setQuizLang((prev) => ({ ...prev, ...rollLanguages([created]) }));
    }
    setTitle("");
    setTitleJa("");
    setDueDate("");
  }

  async function toggleTask(id: string, completed: boolean) {
    const previous = tasks;
    // Optimistic: move the row now, put it back if the write fails.
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed } : task)),
    );

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("tasks")
      .update({ completed })
      .eq("id", id);

    if (updateError) {
      setTasks(previous);
      setError("Could not save that change. Please try again.");
    }
  }

  function renderTitles(task: Task) {
    const showJapanese = quizMode && quizLang[task.id] === "ja";
    const shown = showJapanese ? (task.title_ja ?? task.title) : task.title;
    const answer = showJapanese ? task.title : task.title_ja;
    const quizzable = quizMode && isBilingual(task);
    const isRevealed = revealed[task.id] === true;

    return (
      <div className={styles.titles}>
        <span
          className={task.completed ? styles.completedText : undefined}
          lang={showJapanese ? "ja" : "en"}
        >
          {shown}
        </span>

        {/* Outside quiz mode both languages are always visible. */}
        {!quizMode && isBilingual(task) ? (
          <span
            className={
              task.completed
                ? `${styles.secondaryTitle} ${styles.completedText}`
                : styles.secondaryTitle
            }
            lang="ja"
          >
            {task.title_ja}
          </span>
        ) : null}

        {quizzable && isRevealed ? (
          <span
            className={styles.secondaryTitle}
            lang={showJapanese ? "en" : "ja"}
          >
            {answer}
          </span>
        ) : null}

        {quizzable && !isRevealed ? (
          <button
            type="button"
            className={styles.revealButton}
            onClick={() =>
              setRevealed((prev) => ({ ...prev, [task.id]: true }))
            }
          >
            Show answer
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={`${styles.input} ${styles.inputPrimary}`}
          type="text"
          aria-label="Task in English"
          placeholder="Add a task (English)"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          lang="ja"
          aria-label="Task in Japanese (optional)"
          placeholder="日本語 (optional)"
          value={titleJa}
          onChange={(event) => setTitleJa(event.target.value)}
        />
        <input
          className={styles.dateInput}
          type="date"
          aria-label="Due date (optional)"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
        <button className={styles.button} type="submit" disabled={submitting}>
          Add
        </button>
      </form>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <div className={styles.quizBar}>
        <label className={styles.quizToggle}>
          <input
            type="checkbox"
            checked={quizMode}
            onChange={toggleQuizMode}
          />
          <span>Quiz me</span>
        </label>
        {quizMode ? (
          <span className={styles.quizHint}>
            Each title shows in a random language. Toggle off and on to reshuffle.
          </span>
        ) : null}
      </div>

      {groups.length === 0 ? (
        <p className={styles.empty}>No tasks yet.</p>
      ) : (
        groups.map((group) => (
          <section className={styles.section} key={group.key}>
            <h2 className={styles.sectionTitle}>{group.heading}</h2>
            <ul className={styles.list}>
              {group.tasks.map((task) => {
                const late = daysOverdue(task, today);
                return (
                  <li className={styles.item} key={task.id}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={task.completed}
                      aria-label={`Mark "${task.title}" ${
                        task.completed ? "not complete" : "complete"
                      }`}
                      onChange={(event) =>
                        toggleTask(task.id, event.target.checked)
                      }
                    />
                    {renderTitles(task)}
                    {task.due_date ? (
                      <span
                        className={
                          late > 0 ? styles.dueDateLate : styles.dueDate
                        }
                      >
                        {formatDueDate(task.due_date, today)}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
