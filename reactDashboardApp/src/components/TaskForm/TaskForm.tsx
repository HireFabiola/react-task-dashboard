import { useState, type ChangeEvent, FormEvent } from "react";
import type { TaskFormProps, NewTask } from "../../types";

export function TaskForm({ onAddTask, onClose }: TaskFormProps) {

  // Initialize form field values from the input form
  const [formData, setFormData] = useState<AddedTask>({
    taskNumber: "",
    title: "",
    description: "",
    status: "",
    priority: ""
  });

  // Updates the correct form field as the user types/selects
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Sends the form data back to TaskList
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onAddTask(formData);
    onClose();
  };

    return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select name="priority" value={formData.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        required
      />

      <button type="submit">Save Task</button>
    </form>
  );
}