import type { TaskFilterProps, TaskStatus } from "../../types";
import "../../App.css";

export function TaskFilter({ onFilterChange }: TaskFilterProps) {
  return (
    <div className="filter-stack">
      <select
        onChange={(e) =>
          onFilterChange("status", e.target.value as TaskStatus)
        }
        className="form-select form-select-sm filter-primary"
        defaultValue=""
      >
        <option value="">Filter by status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        onChange={(e) =>
          onFilterChange("priority", e.target.value as "low" | "medium" | "high")
        }
        className="form-select form-select-sm filter-primary"
        defaultValue=""
      >
        <option value="">Filter by priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
}