import type { TaskFilterProps, TaskStatus } from "../../types";
import "../../App.css";

export function TaskFilter({ onFilterChange }: TaskFilterProps) {
  return (
    <div className="d-flex align-items-end gap-3 mb-3">

      {/* Status Filter */}
      <div className="filter-group">
        <label className="form-label small mb-1"></label>
        <select
          onChange={(e) =>
            onFilterChange("status", e.target.value as TaskStatus)
          }
          className="form-select form-select-sm"
        >
          <option value="">Sort by status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="filter-group">
        <label className="form-label small mb-1"></label>
        <select
          onChange={(e) =>
            onFilterChange(
              "priority",
              e.target.value as "low" | "medium" | "high"
            )
          }
          className="form-select form-select-sm"
        >
          <option value="">Sort by priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

    </div>
  );
}