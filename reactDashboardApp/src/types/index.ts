// Types and interfaces for TaskList component
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type NewTask = Omit<Task, "id">; 

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}
 
export interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

// Interface for TaskItem component 
export interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

// Interface for TaskFilter component
export interface TaskFilterProps {
  onFilterChange: (filterName: 
    "status" | "priority", value: string) => void;
}

// Interface for TaskForm component
export interface TaskFormProps {
  onAddTask: (task: NewTask) => void;
  onClose: () => void;
}

