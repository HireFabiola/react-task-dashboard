import { useState } from "react";
import tasksData from "../../data/tasks.json";
import type { Task, AddedTask, TaskStatus } from "../../types/index";
import { TaskItem } from "../TaskList/TaskItem";
import { TaskFilter } from "../TaskFilter/TaskFilter";
import { TaskForm } from "../TaskForm/TaskForm";

// Combined type declaration for the filter state object
type Filters = { status?: TaskStatus; priority?: "low" | "medium" | "high"; };

export function TaskList() {
    // Initialize task list state using task data imported from the JSON test file
    const [tasks, setTasks] = useState<Task[]>(tasksData as Task[]);
    // Initialize filter state with no filters selected
    const [filters, setFilters] = useState<Filters>({});
    // Initiliaze visibility state for the form
    const [showForm, setShowForm] = useState<boolean>(false);
    // Initialize state for search
    const [searchTask, setSearchTask] = useState<string>("");


    // Function to add a new task
    const addTask = (newTask: Omit<Task, "id">) => {
        const taskWithId: Task = {
            ...newTask,
            id: String(tasks.length + 1),
        };

        setTasks((prevTasks) => [...prevTasks, taskWithId]);
    };

    // Deletes a selected task by creating a new array that excludes the task
    // with the matching id, then updates state with that new array
    const handleDelete = (id: string) => {
        setTasks((prevTasks) => {
            const updatedTasks = prevTasks.filter((task) => {
                return task.id !== id;
            });

            return updatedTasks;
        });
    };

    // Updates the status of a selected task by creating a new array where
    // only the task with the matching id receives the new status
    const handleStatusChange = (id: string, newStatus: TaskStatus) => {
        setTasks((prevTasks) => {
            const updatedTasks = prevTasks.map((task) => {
                if (task.id === id) {
                    return {
                        ...task,
                        status: newStatus,
                    };
                }

                return task;
            });

            return updatedTasks;
        });
    };

    // Updates the filter state when either the status or priority dropdown changes
    const handleFilterChange = (
        filterName: "status" | "priority",
        value: string
    ) => {
        setFilters((prevFilters) => {
            return {
                ...prevFilters,
                [filterName]: value === "" ? undefined : value,
            };
        });
    };

    // Creates a filtered version of the task list based on the selected filters
    const filteredTasks = tasks.filter((task) => {
        if (filters.status && task.status !== filters.status) {
            return false;
        }

        if (filters.priority && task.priority !== filters.priority) {
            return false;
        }

        return true;
    });

    return (
        <>
            <div>
                {/* Shows or hides the form */}
                <button onClick={() => setShowForm((prev) => !prev)}>
                    {showForm ? "Cancel" : "Add Task"}
                </button>

                {/* Render form only when showForm is true */}
                {showForm && (
                    <TaskForm
                        onAddTask={addTask}
                        onClose={() => setShowForm(false)}
                    />
                )}
            </div>

            {/* Add seach bar */}
            <input type="text" placeholder="Search tasks..." value={searchTask} onChange={(e) => setSearchTask(e.target.value)} />

            {/* Renders the filter dropdown component and passes down the filter handler */}
            <TaskFilter onFilterChange={handleFilterChange} />

            <div className="d-flex gap-2 flex-column">

                {filteredTasks.length === 0 ? (
                    <p className="text-muted">No tasks match the selected filters</p>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                        />
                    ))
                )}

            </div>
        </>
    );
}