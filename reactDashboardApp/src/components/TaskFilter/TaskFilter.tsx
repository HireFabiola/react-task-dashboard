import type { TaskFilterProps, TaskStatus } from "../../types";

export function TaskFilter({ onFilterChange }: TaskFilterProps) {
  return (
    <div className="d-flex gap-2 mb-3 p-3">
      
      {/* Status Filter */}
      <div>
      <h5>Status</h5>
      <select
        onChange={(event) =>
          onFilterChange("status", event.target.value as TaskStatus)
        }
        className="form-select form-select-sm w-auto"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      </div>

      {/* Priority Filter */}
      <div>
        <h5>Priority</h5>
      <select onChange={(event) => onFilterChange( "priority", event.target.value as "low" | "medium" | "high")} className="form-select form-select-sm w-auto">
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      </div>

    </div>
  );
}
