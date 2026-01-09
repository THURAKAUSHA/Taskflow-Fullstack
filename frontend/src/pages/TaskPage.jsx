import { useEffect, useState } from "react";
import api from "../api/axios";

const THEMES = {
  forest: {
    bg: "bg-green-900",
    card: "bg-green-200 text-green-900",
    btn: "bg-green-500",
  },
  sun: {
    bg: "bg-yellow-900",
    card: "bg-yellow-200 text-yellow-900",
    btn: "bg-yellow-500",
  },
  sky: {
    bg: "bg-sky-900",
    card: "bg-sky-200 text-sky-900",
    btn: "bg-sky-500",
  },
  violet: {
    bg: "bg-purple-900",
    card: "bg-purple-200 text-purple-900",
    btn: "bg-purple-500",
  },
};

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const savedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(
    THEMES[savedTheme] ? savedTheme : "violet"
  );
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username") || "You";

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    api
      .get("tasks/")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTasks(res.data.map((t) => ({ ...t, starred: false })));
        } else {
          setTasks([]);
        }
      })
      .catch(() => setTasks([]));
  }, []);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-400">
        Please log in to see your tasks
      </div>
    );
  }

  const addTask = async () => {
    const title = input.trim();
    if (!title) return;

    const res = await api.post("tasks/", { title, description: "" });
    setTasks((prev) => [...prev, { ...res.data, starred: false }]);
    setInput("");
  };

  const deleteTask = async (id) => {
    await api.delete(`tasks/${id}/`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleStar = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, starred: !t.starred } : t
      )
    );
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const sorted = Array.isArray(tasks)
    ? [...tasks].sort((a, b) => b.starred - a.starred)
    : [];

  return (
    <div className={`min-h-screen ${THEMES[theme].bg} text-white`}>
      <div className="max-w-xl mx-auto pt-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="text-lg font-semibold">
            Welcome, <span className="text-green-300">{username}</span>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setShowThemeMenu((v) => !v)}
              className="px-3 py-1 rounded bg-gray-700 text-sm"
            >
              🎨
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 top-10 bg-gray-800 rounded shadow p-2 z-10">
                {Object.keys(THEMES).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTheme(key);
                      setShowThemeMenu(false);
                    }}
                    className="block w-full text-left px-3 py-1 hover:bg-gray-700 rounded"
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={logout}
              className="px-3 py-1 rounded bg-red-500 text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">TaskFlow</h1>

        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New task..."
            className="flex-1 px-4 py-2 rounded text-black"
          />
          <button
            onClick={addTask}
            className={`${THEMES[theme].btn} px-4 py-2 rounded font-semibold`}
          >
            Add
          </button>
        </div>

        {sorted.length === 0 && (
          <p className="text-gray-300 text-center">No tasks yet</p>
        )}

        <div className="space-y-3">
          {sorted.map((task) => (
            <div
              key={task.id}
              className={`flex justify-between items-center p-3 rounded ${THEMES[theme].card}`}
            >
              <div className="flex items-center gap-2">
                {task.starred && <span>⭐</span>}
                <span>{task.title}</span>
              </div>

              <div className="relative group">
                <button className="px-2">⋮</button>

                <div className="absolute right-0 hidden group-hover:block bg-white text-black rounded shadow w-36 z-10">
                  <button
                    onClick={() => toggleStar(task.id)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    {task.starred ? "Unstar" : "Star"}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="block w-full text-left px-3 py-2 hover:bg-red-100 text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
