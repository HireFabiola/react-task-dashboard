import type { TaskItemProps, TaskStatus } from "../../types";

// Function to return display of a single task item
export function TaskItem({ task, onDelete, onStatusChange }: TaskItemProps) {
  return (
    <div className="card mb-3 p-3 bg-dark text-white border-0 shadow-sm">
      <div className="d-flex justify-content-between align-items-start">
        <p className="mb-0">
          <strong>Task {task.id}:</strong> {task.title}
        </p>

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
            className="btn btn-sm btn-secondary"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="text-start mt-3">
        <p>
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
    </div>
  );
}