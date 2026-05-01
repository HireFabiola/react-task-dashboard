import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import tasksData from "../../data/tasks.json";
import type { Task, TaskStatus } from "../../types/index";
import { TaskList } from "../TaskList/TaskList";
import { TaskFilter } from "../TaskFilter/TaskFilter";
import { TaskForm } from "../TaskForm/TaskForm";
import "../../App.css";

type Filters = {
  status?: TaskStatus;
  priority?: "low" | "medium" | "high";
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function CalendarSection({ tasks }: { tasks: Task[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const selectedDateKey = getDateKey(selectedDate);

  const taskDateKeys = useMemo(() => {
    return new Set(tasks.map((task) => task.dueDate));
  }, [tasks]);

  const selectedTasks = tasks.filter((task) => task.dueDate === selectedDateKey);

  return (
    <section className="card-clean calendar-section">
      <div className="section-title-row">
        <div>
          <p className="section-kicker">Schedule</p>
          <h2>
            {activeStartDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>
        <span className="section-pill">{selectedTasks.length} due</span>
      </div>

      <div className="calendar-grid">
        <Calendar
          onChange={(value) => {
            if (value instanceof Date) setSelectedDate(value);
          }}
          onActiveStartDateChange={({ activeStartDate }) => {
            if (activeStartDate) setActiveStartDate(activeStartDate);
          }}
          value={selectedDate}
          className="task-calendar"
          tileClassName={({ date, view }) => {
            if (view !== "month") return null;

            const key = getDateKey(date);
            const classes = [];

            if (key === selectedDateKey) classes.push("is-selected");
            if (taskDateKeys.has(key)) classes.push("has-task");

            return classes.join(" ");
          }}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;
            return taskDateKeys.has(getDateKey(date)) ? <span className="task-dot" /> : null;
          }}
        />

        <aside className="date-agenda">
          <p className="section-kicker">Selected date</p>
          <h3>{selectedDate.toLocaleDateString()}</h3>

          {selectedTasks.length === 0 ? (
            <p className="empty-state">No tasks due on this date.</p>
          ) : (
            <div className="agenda-list">
              {selectedTasks.map((task) => (
                <div key={task.id} className="agenda-item">
                  <strong>{task.title}</strong>
                  <span>{task.status} · {task.priority} priority</span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
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
  setTasks((prevTasks) => {
    const updatedTasks = prevTasks
      .filter((task) => task.id !== id)
      .map((task, index) => ({
        ...task,
        id: String(index + 1),
      }));

    return updatedTasks;
  });
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
    const matchesSearch = !searchText || task.title.toLowerCase().includes(searchText);
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesPriority = !filters.priority || task.priority === filters.priority;


    return matchesSearch && matchesStatus && matchesPriority;
  });

  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length;

  const overdueTasks = tasks.filter((task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return task.status !== "completed" && dueDate < today;
  }).length;

  const completionPercentage = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const completedPercentage = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const inProgressPercentage = tasks.length
    ? Math.round((inProgressTasks / tasks.length) * 100)
    : 0;

  const pendingPercentage = tasks.length
    ? Math.round((pendingTasks / tasks.length) * 100)
    : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTasks = tasks
    .filter((task) => {
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      return task.status !== "completed" && due >= today;
    })
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  const nextDueDate = upcomingTasks[0]?.dueDate;

  const nextDueTasks = nextDueDate
    ? upcomingTasks.filter((t) => t.dueDate === nextDueDate)
    : [];

  const daysUntilDue = nextDueDate
    ? Math.ceil(
      (new Date(nextDueDate).setHours(0, 0, 0, 0) - today.getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : null;
  return (
    <main className="task-dashboard-page">
      <div className="task-dashboard-shell">
        <header className="dashboard-hero">
          <div>
            <p className="section-kicker">Workspace overview</p>
            <h1>Task Dashboard</h1>
            <p>Plan work, monitor progress, and review due dates from one clean view</p>
          </div>
        </header>

        <section className="metric-grid">
          <article className="metric-card">
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
          </article>
          <article className="metric-card">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </article>
          <article className="metric-card">
            <span>In Progress</span>
            <strong>{inProgressTasks}</strong>
          </article>
          <article className="metric-card danger-metric hover-summary-card">
            <span>Overdue</span>
            <strong>{overdueTasks}</strong>

            <div className="summary-hover-preview">
              <strong>Overdue Tasks</strong>
              {tasks.filter((task) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const dueDate = new Date(task.dueDate);
                dueDate.setHours(0, 0, 0, 0);

                return task.status !== "completed" && dueDate < today;
              }).length === 0 ? (
                <p>No overdue tasks.</p>
              ) : (
                tasks
                  .filter((task) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const dueDate = new Date(task.dueDate);
                    dueDate.setHours(0, 0, 0, 0);

                    return task.status !== "completed" && dueDate < today;
                  })
                  .slice(0, 4)
                  .map((task) => (
                    <p key={task.id}>
                      {task.title} — due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  ))
              )}
            </div>
          </article>
        </section>

        <div className="dashboard-workspace">
          <aside className="card-clean task-column">
            <div className="section-title-row">
              <div>
                <p className="section-kicker">Task list</p>
                <h2>Current Work</h2>
              </div>

              <span className="section-pill">{filteredTasks.length}</span>
            </div>
            <div className="input-group search-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search tasks..."
                value={searchTask}
                onChange={(e) => setSearchTask(e.target.value)}
              />
            </div>
            <div className="task-actions-row">
              <div className="filter-shell">
                <TaskFilter onFilterChange={handleFilterChange} />
              </div>

              <button
                className="btn btn-primary btn-sm add-task-inline-btn"
                onClick={() => setShowForm(true)}
              >
                Add Task
              </button>
            </div>

            <div className="task-scroll-area">
              <TaskList
                tasks={filteredTasks}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </div>
          </aside>

          <section className="dashboard-right-column">
            <CalendarSection tasks={tasks} />

            <div className="lower-grid">
              <article className="card-clean progress-card">
                <div className="section-title-row compact">
                  <div>
                    <p className="section-kicker">Progress</p>
                    <h2>Status</h2>
                  </div>
                </div>

                <div className="progress-display">
                  <div
                    className="progress-pie"
                    style={{
                      background: `conic-gradient(
                        #198754 0deg ${(completedTasks / Math.max(tasks.length, 1)) * 360}deg,
                        #fd7e14 ${(completedTasks / Math.max(tasks.length, 1)) * 360}deg ${((completedTasks + inProgressTasks) / Math.max(tasks.length, 1)) * 360}deg,
                        #6c757d ${((completedTasks + inProgressTasks) / Math.max(tasks.length, 1)) * 360}deg 360deg
                      )`,
                    }}
                  >
                    {/* <div className="progress-pie-center">
                      <strong>{completionPercentage}%</strong>
                      <span>complete</span>
                    </div> */}
                  </div>

                  <div className="progress-list">
                    <p><span className="status-dot completed" /> Completed: {completedPercentage}%</p>
                    <p><span className="status-dot progress" /> In progress: {inProgressPercentage}%</p>
                    <p><span className="status-dot pending" /> Pending: {pendingPercentage}%</p>
                  </div>
                </div>
              </article>

              <article className="card-clean priority-card hover-summary-card">
                <div className="section-title-row compact">
                  <div>
                    <p className="section-kicker">Focus</p>
                    <h2>Priority</h2>
                  </div>
                </div>

                <div className="priority-content">
                  <strong>{highPriorityTasks}</strong>
                  <span>high priority tasks</span>
                  <div className="priority-meter">
                    <div style={{ width: `${tasks.length ? (highPriorityTasks / tasks.length) * 100 : 0}%` }} />
                  </div>
                </div>

                <div className="summary-hover-preview right-preview">
                  <strong>High Priority Tasks</strong>
                  {tasks.filter((task) => task.priority === "high").length === 0 ? (
                    <p>No high priority tasks.</p>
                  ) : (
                    tasks
                      .filter((task) => task.priority === "high")
                      .slice(0, 4)
                      .map((task) => (
                        <p key={task.id}>
                          {task.title} — {task.status}
                        </p>
                      ))
                  )}
                </div>
              </article>
            </div>
            <article className="card-clean upcoming-card">
              <div className="section-title-row compact">
                <div>
                  <p className="section-kicker">Up next</p>
                  <h2>Upcoming Due</h2>
                </div>

                {daysUntilDue !== null && (
                  <span className="section-pill">
                    {daysUntilDue === 0
                      ? "Due today"
                      : `${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"}`}
                  </span>
                )}
              </div>

              {nextDueTasks.length === 0 ? (
                <p className="empty-state">No upcoming tasks.</p>
              ) : (
                <div className="upcoming-list">
                  {nextDueTasks.map((task) => (
                    <div key={task.id} className="upcoming-item">
                      <strong>{task.title}</strong>
                      {task.description && <p>{task.description}</p>}
                      <span>
                        Due {new Date(task.dueDate).toLocaleDateString()} · {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        </div>
        {showForm && (
          <div className="task-modal-backdrop">
            <div className="task-modal-card">
              <div className="task-modal-header">
                <div>
                  <p className="section-kicker">New task</p>
                  <h2>Add Task</h2>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowForm(false)}
                />
              </div>

              <TaskForm
                onAddTask={addTask}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
