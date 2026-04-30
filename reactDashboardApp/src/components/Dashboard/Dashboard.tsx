import { useState } from "react";
import tasksData from "../../data/tasks.json";
import type { Task, TaskStatus } from "../../types/index";
import { TaskList } from "../TaskList/TaskList";
import { TaskFilter } from "../TaskFilter/TaskFilter";
import { TaskForm } from "../TaskForm/TaskForm";

type Filters = {
  status?: TaskStatus;
  priority?: "low" | "medium" | "high";
};

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(tasksData as Task[]);
  const [filters, setFilters] = useState<Filters>({});
  const [showForm, setShowForm] = useState(false);
  const [searchTask, setSearchTask] = useState("");

  const addTask = (newTask: Omit<Task, "id">) => {
    const taskWithId: Task = {
      ...newTask,
      id: crypto.randomUUID(),
    };

    setTasks((prevTasks) => [...prevTasks, taskWithId]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleFilterChange = (
    filterName: "status" | "priority",
    value: string
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value === "" ? undefined : value,
    }));
  };

  const filteredTasks = tasks.filter((task) => {
    const searchText = searchTask.trim().toLowerCase();

    const matchesSearch =
      !searchText || task.title.toLowerCase().includes(searchText);

    const matchesStatus =
      !filters.status || task.status === filters.status;

    const matchesPriority =
      !filters.priority || task.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <main className="container py-4">
      <header className="mb-4">
        <h1>Dashboard</h1>
        <p className="text-muted">Manage your tasks</p>
      </header>

      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "Add Task"}
        </button>
      </div>

      {showForm && (
        <TaskForm
          onAddTask={addTask}
          onClose={() => setShowForm(false)}
        />
      )}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search tasks by title..."
        value={searchTask}
        onChange={(e) => setSearchTask(e.target.value)}
      />

      <TaskFilter onFilterChange={handleFilterChange} />

      <TaskList
        tasks={filteredTasks}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </main>
  );
}