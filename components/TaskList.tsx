"use client";

import { useMemo, useState, useTransition } from "react";
import { archiveTask, editTask } from "@/actions/actions";
import styles from "./TaskList.module.css";

// If @prisma/client generates a Task type for you, prefer that instead:
//   import type { Task } from "@prisma/client";
// Left explicit here so this file compiles even before your schema settles.
type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  topic: string;
  status: "Todo" | "In-Progress" | "Complete";
  archived: boolean;
};

const STATUSES: Task["status"][] = ["Todo", "In-Progress", "Complete"];
const TOPICS = ["Coursework", "Personal", "Admin", "Reading", "Project"];

type SortKey = "dueDate" | "status" | "topic";

function isOverdue(task: Task) {
  return !task.archived && task.status !== "Complete" && task.dueDate < new Date();
}

function toDateInputValue(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

function statusClass(status: Task["status"]) {
  if (status === "Todo") return styles.statusTodo;
  if (status === "In-Progress") return styles.statusInProgress;
  return styles.statusComplete;
}

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [sortBy, setSortBy] = useState<SortKey>("dueDate");
  const [showArchived, setShowArchived] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const visible = useMemo(() => {
    const filtered = tasks.filter((t) => (showArchived ? t.archived : !t.archived));
    const statusOrder: Record<Task["status"], number> = { Todo: 0, "In-Progress": 1, Complete: 2 };
    return [...filtered].sort((a, b) => {
      if (sortBy === "topic") return a.topic.localeCompare(b.topic);
      if (sortBy === "status") return statusOrder[a.status] - statusOrder[b.status];
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }, [tasks, sortBy, showArchived]);

  const overdueCount = tasks.filter(isOverdue).length;

  const handleArchive = (id: number) => {
    startTransition(async () => {
      await archiveTask(id);
    });
  };

  const handleStatusChange = (task: Task, status: Task["status"]) => {
    startTransition(async () => {
      await editTask(task.id, task.title, task.description, task.dueDate, task.topic, status);
    });
  };

  return (
    <section aria-label="Tasks" className={styles.wrap}>
      {overdueCount > 0 && (
        <p className={styles.overdueFlag} role="status">
          {overdueCount} overdue
        </p>
      )}

      <nav className={styles.controls} aria-label="Sort and filter tasks">
        <ul className={styles.sortTabs} role="group" aria-label="Sort by">
          {([
            { key: "dueDate", label: "Due date" },
            { key: "status", label: "Status" },
            { key: "topic", label: "Topic" },
          ] as { key: SortKey; label: string }[]).map((opt) => (
            <li key={opt.key}>
              <button
                type="button"
                aria-pressed={sortBy === opt.key}
                className={styles.sortTab}
                onClick={() => setSortBy(opt.key)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>

        <label className={styles.archiveToggle} htmlFor="show-archived">
          <input
            id="show-archived"
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          Show archived
        </label>
      </nav>

      <ul className={styles.ledger}>
        {visible.length === 0 && (
          <li className={styles.empty}>
            {showArchived ? "Nothing archived yet." : "No open entries — add one above."}
          </li>
        )}

        {visible.map((task) => {
          const overdue = isOverdue(task);
          const editing = editingId === task.id;

          return (
            <li
              key={task.id}
              className={`${styles.row} ${overdue ? styles.rowOverdue : ""}`}
            >
              {overdue && <span className={styles.dogear} aria-hidden="true" />}

              {editing ? (
                <EditRow
                  task={task}
                  onCancel={() => setEditingId(null)}
                  onSaved={() => setEditingId(null)}
                />
              ) : (
                <>
                  <hgroup className={styles.main}>
                    <h3 className={styles.title}>{task.title}</h3>
                    {task.description && <p className={styles.desc}>{task.description}</p>}
                  </hgroup>

                  <p className={styles.meta}>
                    <span className={styles.tag}>{task.topic}</span>
                    <time
                      className={`${styles.due} ${overdue ? styles.dueOverdue : ""}`}
                      dateTime={task.dueDate.toISOString()}
                    >
                      {overdue && <span className="sr-only">Overdue: </span>}
                      {task.dueDate.toLocaleDateString("en-ZA", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </p>

                  <p className={styles.statusCell}>
                    <label className="sr-only" htmlFor={`status-${task.id}`}>
                      Status for {task.title}
                    </label>
                    <select
                      id={`status-${task.id}`}
                      className={`${styles.statusSelect} ${statusClass(task.status)}`}
                      value={task.status}
                      disabled={task.archived || isPending}
                      onChange={(e) => handleStatusChange(task, e.target.value as Task["status"])}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </p>

                  <p className={styles.actions}>
                    {!task.archived ? (
                      <>
                        <button
                          type="button"
                          className={styles.btnGhost}
                          onClick={() => setEditingId(task.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.btnGhost}
                          disabled={isPending}
                          onClick={() => handleArchive(task.id)}
                        >
                          Archive 📦
                        </button>
                      </>
                    ) : (
                      <span className={styles.archivedPill}>Archived</span>
                    )}
                  </p>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function EditRow({
  task,
  onCancel,
  onSaved,
}: {
  task: Task;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [dueDate, setDueDate] = useState(toDateInputValue(task.dueDate));
  const [topic, setTopic] = useState(task.topic);
  const [status, setStatus] = useState<Task["status"]>(task.status);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      await editTask(task.id, title.trim(), description.trim(), new Date(dueDate), topic, status);
      onSaved();
    });
  };

  return (
    <fieldset className={styles.editFieldset}>
      <legend className="sr-only">Editing {task.title}</legend>

      <label className={styles.editLabel} htmlFor={`edit-title-${task.id}`}>
        Title
      </label>
      <input
        id={`edit-title-${task.id}`}
        className={styles.editInput}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className={styles.editLabel} htmlFor={`edit-desc-${task.id}`}>
        Description
      </label>
      <textarea
        id={`edit-desc-${task.id}`}
        className={styles.editTextarea}
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <span className={styles.editGrid}>
        <span>
          <label className={styles.editLabel} htmlFor={`edit-due-${task.id}`}>
            Due date
          </label>
          <input
            id={`edit-due-${task.id}`}
            className={styles.editInput}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </span>

        <span>
          <label className={styles.editLabel} htmlFor={`edit-topic-${task.id}`}>
            Topic
          </label>
          <select
            id={`edit-topic-${task.id}`}
            className={styles.editInput}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </span>

        <span>
          <label className={styles.editLabel} htmlFor={`edit-status-${task.id}`}>
            Status
          </label>
          <select
            id={`edit-status-${task.id}`}
            className={styles.editInput}
            value={status}
            onChange={(e) => setStatus(e.target.value as Task["status"])}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </span>
      </span>

      <span className={styles.editActions}>
        <button type="button" className={styles.btnGhost} onClick={onCancel} disabled={isPending}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={save}
          disabled={isPending || !title.trim()}
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </span>
    </fieldset>
  );
}