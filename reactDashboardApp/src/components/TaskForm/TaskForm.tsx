import { useState, type ChangeEvent, type FormEvent } from "react";
import type { TaskFormProps } from "../../types";
import type { TaskStatus } from "../../types/index";


export function TaskForm({ onAddTask, onClose }: TaskFormProps) {
 const [formData, setFormData] = useState({
  title: "",
  description: "",
  status: "pending" as TaskStatus,
  priority: "medium" as "low" | "medium" | "high",
  dueDate: "",
});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onAddTask(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4">
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label"></label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select status
          </option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label"/>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select priority
          </option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Due Date</label>
        <input
          className="form-control"
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Save Task
      </button>
    </form>
  );
}