import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import tasksData from "../../data/tasks.json";
import type { Task, TaskStatus } from "../../types/index";
import { TaskList } from "../TaskList/TaskList";
import { TaskFilter } from "../TaskFilter/TaskFilter";
import { TaskForm } from "../TaskForm/TaskForm";

type Filters = {
  status?: TaskStatus;
  priority?: "low" | "medium" | "high";
};

function CalendarPreview({ tasks }: { tasks: Task[] }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getDateKey = (date: Date) => date.toISOString().split("T")[0];

  const selectedDateKey = getDateKey(selectedDate);

  const tasksForSelectedDate = tasks.filter(
    (task) => task.dueDate === selectedDateKey
  );

  const hasTasksOnDate = (date: Date) => {
    const dateKey = getDateKey(date);
    return tasks.some((task) => task.dueDate === dateKey);
  };

  return (
    <div className="calendar-preview">
      <Calendar
        onClickDay={(date) => setSelectedDate(date)}
        value={selectedDate}
        tileContent={({ date, view }) => {
          if (view === "month" && hasTasksOnDate(date)) {
            return <div className="text-primary small fw-bold">•</div>;
          }

          return null;
        }}
      />

      <div className="mt-3">
        <h4 className="h6 mb-2">
          Tasks due on {selectedDate.toLocaleDateString()}
        </h4>

        {tasksForSelectedDate.length === 0 ? (
          <p className="text-muted mb-0">No tasks due on this date.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {tasksForSelectedDate.map((task) => (
              <li
                key={task.id}
                className="list-group-item px-0 d-flex justify-content-between align-items-center"
              >
                <span>{task.title}</span>
                <span className="badge text-bg-secondary">{task.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(tasksData as Task[]);
  const [filters, setFilters] = useState<Filters>({});
  const [showForm, setShowForm] = useState(false);
  const [searchTask, setSearchTask] = useState("");

  const addTask = (newTask: Omit<Task, "id">) => {
    const highestTaskNumber = tasks.reduce((highest, task) => {
      const taskNumber = Number(task.id);

      return Number.isNaN(taskNumber) ? highest : Math.max(highest, taskNumber);
    }, 0);

    const taskWithId: Task = {
      ...newTask,
      id: String(highestTaskNumber + 1),
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

    const matchesStatus = !filters.status || task.status === filters.status;

    const matchesPriority =
      !filters.priority || task.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const overdueTasks = tasks.filter((task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return task.status !== "completed" && dueDate < today;
  }).length;

  const tasksDueThisWeek = tasks.filter((task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate >= today && dueDate <= sevenDaysFromNow;
  }).length;

  const completionPercentage = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const tasksByDueDate = tasks.reduce<Record<string, Task[]>>((groups, task) => {
    const dueDate = task.dueDate || "No due date";

    if (!groups[dueDate]) {
      groups[dueDate] = [];
    }

    groups[dueDate].push(task);
    return groups;
  }, {});

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div
        className="bg-white rounded shadow p-4 w-100"
        style={{ maxWidth: "1200px", height: "85vh" }}
      >
        <header className="mb-4">
          <h1 className="display-6 mb-1">Dashboard</h1>
          <p className="text-muted mb-0">Manage your tasks and track progress.</p>
        </header>

        <div
          className="dashboard-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "1.5rem",
            height: "calc(100% - 90px)",
          }}
        >
          {/* Left 1/3: task list column */}
          <aside className="card h-100 text-start overflow-hidden">
            <div className="card-body d-flex flex-column h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Tasks</h2>
                <button
                  className="btn btn-primary btn-sm"
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

              <div className="mb-3">
                <TaskFilter onFilterChange={handleFilterChange} />
              </div>

              <div className="flex-grow-1 overflow-auto text-start">
                <TaskList
                  tasks={filteredTasks}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </aside>

          {/* Right 2/3: three equal stacked rows */}
          <section
            className="h-100"
            style={{
              display: "grid",
              gridTemplateRows: "1fr 1fr 1fr",
              gap: "1rem",
              minHeight: 0,
            }}
          >
            {/* Row 1: calendar preview */}
            <div className="card overflow-auto" style={{ minHeight: 0 }}>
              <div className="card-body text-start">
                <h3 className="h5 mb-3">Calendar Preview</h3>

                <CalendarPreview tasks={tasks} />
              </div>
            </div>

            {/* Row 2: charts */}
            <div className="card overflow-hidden" style={{ minHeight: 0 }}>
              <div className="card-body">
                <h3 className="h5 mb-3 text-start">Task Breakdown</h3>

                <div className="row text-center align-items-center h-100">
                  <div className="col-md-6">
                    <div
                      className="border rounded-circle mx-auto d-flex align-items-center justify-content-center"
                      style={{ width: "140px", height: "140px" }}
                    >
                      Status Chart
                    </div>
                    <p className="text-muted mt-2 mb-0">By status</p>
                  </div>

                  <div className="col-md-6">
                    <div
                      className="border rounded-circle mx-auto d-flex align-items-center justify-content-center"
                      style={{ width: "140px", height: "140px" }}
                    >
                      Priority Chart
                    </div>
                    <p className="text-muted mt-2 mb-0">By priority</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: stats */}
            <div className="card overflow-auto" style={{ minHeight: 0 }}>
              <div className="card-body text-start">
                <h3 className="h5 mb-3">Task Insights</h3>

                <div className="row text-center g-3">
                  <div className="col-6 col-lg-3">
                    <div className="border rounded p-3 h-100">
                      <h4 className="mb-1">{tasks.length}</h4>
                      <p className="text-muted mb-0">Total Tasks</p>
                    </div>
                  </div>

                  <div className="col-6 col-lg-3">
                    <div className="border rounded p-3 h-100">
                      <h4 className="mb-1">{completedTasks}</h4>
                      <p className="text-muted mb-0">Completed</p>
                    </div>
                  </div>

                  <div className="col-6 col-lg-3">
                    <div className="border rounded p-3 h-100">
                      <h4 className="mb-1">{overdueTasks}</h4>
                      <p className="text-muted mb-0">Overdue</p>
                    </div>
                  </div>

                  <div className="col-6 col-lg-3">
                    <div className="border rounded p-3 h-100">
                      <h4 className="mb-1">{completionPercentage}%</h4>
                      <p className="text-muted mb-0">Complete</p>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info mt-3 mb-0">
                  {tasksDueThisWeek} task{tasksDueThisWeek === 1 ? "" : "s"} due within the next 7 days.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
