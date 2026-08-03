"use client";

import { useState } from "react";
import { createTask } from "@/actions/actions";
import styles from "./TaskForm.module.css";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [topic, setTopic] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title.trim().length > 0 && dueDate.length > 0 && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    await createTask(title.trim(), description.trim(), dueDate, topic.trim());
    setTitle("");
    setDescription("");
    setDueDate("");
    setTopic("");
    setSubmitting(false);
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>New todo entry</legend>

        <p className={styles.fieldWide}>
          <label className={styles.label} htmlFor="task-title">
            Title
          </label>
          <input
            id="task-title"
            className={styles.input}
            type="text"
            placeholder="What needs doing?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
        </p>

        <p className={styles.fieldWide}>
          <label className={styles.label} htmlFor="task-description">
            Description
          </label>
          <input
            id="task-description"
            className={styles.input}
            type="text"
            placeholder="Optional detail"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </p>

        <p className={styles.field}>
          <label className={styles.label} htmlFor="task-due-date">
            Due date
          </label>
          <input
            id="task-due-date"
            className={styles.input}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </p>

        <p className={styles.field}>
          <label className={styles.label} htmlFor="task-topic">
            Topic
          </label>
          <input
            id="task-topic"
            className={styles.input}
            type="text"
            placeholder="e.g. Coursework"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </p>

        <button type="submit" className={styles.submit} disabled={!canSubmit}>
          {submitting ? "Filing…" : "File entry"}
        </button>
      </fieldset>
    </form>
  );
}