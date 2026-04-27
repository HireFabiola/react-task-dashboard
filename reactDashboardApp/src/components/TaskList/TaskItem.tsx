import type { TaskItemProps } from "../../types";
import type { TaskStatus } from "../../types";

// Function to return display of a single task item
export function TaskItem({ task, onDelete, onStatusChange }: TaskItemProps) {
  return (

    // Outermost container for whole task item display
    <div className="card mb-3 p-3 bg-dark text-white border-0 shadow-sm">

      {/* Wrapper container to keep task id and pending and delet buttons aligned horizontally */}
      <div className="d-flex justify-content-between align-items-start">
        <p className="mb-0">
          <strong>Task {task.id}:</strong> {task.title}
        </p>

        {/* Add dropdown */}
        <div className="d-flex gap-2">
          <select value={task.status} onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)} className="form-select form-select-sm w-auto">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/*  Create dynamic button and attach parent event listener */}
          <button className="btn btn-sm btn-secondary" onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>

      {/* Wrapper container for description, priority and due date */}
      <div className="text-start mt-3 ">
        <p><strong>Description:</strong> {task.description}</p>
        <p>

          {/* Add conditional for text color based on task priority */}
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

          {/* Add due date */}
          <span>
            <strong>Due: </strong>{new Date(task.dueDate).toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>
  )
}

