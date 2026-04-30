import type { TaskItemProps, TaskStatus } from "../../types";
import "../../App.css";

export function TaskItem({ task, onDelete, onStatusChange }: TaskItemProps) {
  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  return (
    <div
      className={`task-item 
        ${task.priority === "high" ? "task-high" : ""}
        ${isOverdue ? "task-overdue" : ""}
      `}
    >
      <div className="task-hover-wrapper">
        {/* MAIN VISIBLE CONTENT */}
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="mb-1">
              <strong>Task {task.id}:</strong> {task.title}
            </p>

            <p className="mb-1">
              <strong>Description:</strong> {task.description}
            </p>

            <p className="mb-0">
              <span
                className={
                  task.priority === "high"
                    ? "text-danger"
                    : task.priority === "medium"
                      ? "text-warning"
                      : "text-success"
                }
              >
                <strong>Priority:</strong> {task.priority}
              </span>

              {" | "}

              <span>
                <strong>Due: </strong>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </p>
          </div>

          {/* ACTIONS */}
          <div className="d-flex gap-2">
            <select
              value={task.status}
              onChange={(event) =>
                onStatusChange(task.id, event.target.value as TaskStatus)
              }
              className="form-select form-select-sm w-auto"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button
              className="btn btn-sm btn-delete"
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
            >
              &times;
            </button>
          </div>
        </div>
       
      </div>
    </div>
  );
}