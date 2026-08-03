"use client";

import { useState } from "react";
import { createTask } from "@/actions/actions";

export default function TaskForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [topic, setTopic] = useState("all");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createTask(title, description, dueDate, topic);
        setTitle("");
        setDescription("");
        setDueDate("");
        setTopic("all");
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="date" placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <input type="text" placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
            <button type="submit">Add Task</button>
        </form>
    );
}