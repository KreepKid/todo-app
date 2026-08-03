import { getTasks } from "@/actions/actions";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default async function Home() {
  const tasks = await getTasks();

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="wordmark">
          Todo<span>List</span>
        </h1>
        <p className="tagline">A single-user todo app — stored and rendered locally, nowhere else</p>
      </header>

      <section className="content">
        <TaskForm />
        <TaskList tasks={tasks} />
      </section>
    </main>
  );
}