i
import React, { useState, useEffect } from "react";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [editId, setEditId] = useState(null);

  // Load saved tasks on mount (browser only) and normalize fields
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("tasks");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return;
      const normalized = parsed.map((t) => {
        const tl = Number(t.timeLimit) || 0;
        const remaining =
          typeof t.remainingTime === "number" ? t.remainingTime : tl * 60;
        return {
          id: t.id ?? Date.now(),
          title: t.title ?? "",
          timeLimit: tl,
          remainingTime: remaining,
          completed: !!t.completed,
        };
      });
      setTasks(normalized);
    } catch (err) {
      // silent fail - invalid saved data
      // eslint-disable-next-line no-console
      console.error("Failed to load tasks from localStorage:", err);
    }
  }, []);

  // Persist tasks to localStorage (browser only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to save tasks to localStorage:", err);
    }
  }, [tasks]);

  // Countdown interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          const remaining = Number(t.remainingTime) || 0;
          if (!t.completed && remaining > 0) {
            return { ...t, remainingTime: remaining - 1 };
          }
          return t;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = () => {
    const minutes = Number(timeLimit);
    if (!newTask.trim() || !minutes || minutes <= 0) return;

    if (editId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editId
            ? {
                ...t,
                title: newTask,
                timeLimit: minutes,
                remainingTime: minutes * 60,
              }
            : t
        )
      );
      setEditId(null);
    } else {
      setTasks((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: newTask,
          timeLimit: minutes,
          remainingTime: minutes * 60,
          completed: false,
        },
      ]);
    }
    setNewTask("");
    setTimeLimit("");
  };

  const handleDelete = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleEdit = (task) => {
    setNewTask(task.title);
    setTimeLimit(String(task.timeLimit ?? ""));
    setEditId(task.id);
  };

  const handleToggle = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const formatTime = (secs) => {
    const total = Number(secs) || 0;
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">📝 To-Do List</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="border rounded-lg p-2 flex-grow"
          />
          <input
            type="number"
            placeholder="Time (min)"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="border rounded-lg p-2 w-28"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex justify-between items-center p-3 rounded-lg border ${
                task.completed ? "bg-green-100" : "bg-gray-50"
              }`}
            >
              <div className="flex flex-col">
                <span className={`text-lg ${task.completed ? "line-through text-gray-500" : ""}`}>
                  {task.title}
                </span>
                <small className="text-gray-600">⏱ {formatTime(task.remainingTime)}</small>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleToggle(task.id)} className="text-green-600 hover:underline">
                  {task.completed ? "Undo" : "Done"}
                </button>
                <button onClick={() => handleEdit(task)} className="text-blue-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && <p className="text-center text-gray-500 mt-6">No tasks yet 😴</p>}
      </div>
    </div>
  );
}