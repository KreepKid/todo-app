import { getTasks } from "@/actions/actions";
import  TaskForm  from "@/components/TaskForm";

export default async function Home() {

  const tasks = await getTasks();

  return (
    <main>
      <h1>My Tasks</h1>
      <TaskForm />
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title} - {task.description} - {task.dueDate.toLocaleDateString()} - {task.topic} - {task.status}</li>
        ))}
      </ul>
    </main>
  );

}

