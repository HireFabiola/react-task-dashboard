import type { Task, TaskStatus } from "../../types/index";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
};

export function TaskList({
  tasks,
  onStatusChange,
  onDelete,
}: TaskListProps) {
  return (
    <div className="d-flex gap-2 flex-column">
      {tasks.length === 0 ? (
        <p className="text-muted">No tasks match the selected filters</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}