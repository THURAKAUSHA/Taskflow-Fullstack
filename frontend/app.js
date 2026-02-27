// main React app for TaskFlow frontend

const { useState, useEffect } = React;

const apiBase = "https://taskflow-fullstack-yb0m.onrender.com/api";

// attach JWT token if exists
function getHeaders() {
  const token = localStorage.getItem("access");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  return headers;
}

// small helper for API calls
async function request(path, options = {}) {
  const res = await fetch(apiBase + path, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) }
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json().catch(() => null);
}

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // load tasks when user exists
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setUser({}); 
      loadTasks();
    }
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await request("/tasks/");
      setTasks(data || []);
    } catch (err) {
      console.log("Could not load tasks");
    }
    setLoading(false);
  }

  function handleLogin(userObj) {
    setUser(userObj);
    loadTasks();
  }

  function handleLogout() {
    localStorage.clear();
    setUser(null);
    setTasks([]);
  }

  return user
    ? React.createElement(TaskArea, {
        tasks,
        loading,
        refresh: loadTasks,
        onLogout: handleLogout
      })
    : React.createElement(LoginForm, { onLogin: handleLogin });
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      if (signup) {
        await request("/accounts/register/", {
          method: "POST",
          body: JSON.stringify({ username, password })
        });
      }

      const data = await request("/accounts/login/", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      onLogin({ username });
    } catch (err) {
      setError("Invalid credentials");
    }
  }

  return React.createElement(
    "form",
    { className: "login-form", onSubmit: submit },
    React.createElement("h2", null, signup ? "Sign Up" : "Login"),
    error && React.createElement("p", { className: "error" }, error),

    React.createElement("input", {
      type: "text",
      placeholder: "Username",
      value: username,
      onChange: e => setUsername(e.target.value),
      required: true
    }),

    React.createElement("input", {
      type: "password",
      placeholder: "Password",
      value: password,
      onChange: e => setPassword(e.target.value),
      required: true
    }),

    React.createElement(
      "button",
      { className: "btn" },
      signup ? "Create Account" : "Login"
    ),

    React.createElement(
      "p",
      {
        className: "toggle",
        onClick: () => setSignup(!signup)
      },
      signup ? "Already have an account? Login" : "Don't have an account? Sign up"
    )
  );
}

function TaskArea({ tasks, loading, refresh, onLogout }) {
  const [title, setTitle] = useState("");

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    await request("/tasks/", {
      method: "POST",
      body: JSON.stringify({ title, description: "" })
    });

    setTitle("");
    refresh();
  }

  async function toggleComplete(id, completed) {
    await request("/tasks/" + id + "/", {
      method: "PUT",
      body: JSON.stringify({ completed })
    });
    refresh();
  }

  async function deleteTask(id) {
    await fetch(apiBase + "/tasks/" + id + "/", {
      method: "DELETE",
      headers: getHeaders()
    });
    refresh();
  }

  const sorted = [...tasks].sort((a, b) => a.completed - b.completed);

  return React.createElement(
    "div",
    null,

    React.createElement(
      "div",
      { id: "header" },
      React.createElement("h1", null, "TaskFlow"),
      React.createElement(
        "button",
        { id: "logout", onClick: onLogout },
        "Logout"
      )
    ),

    React.createElement(
      "form",
      { id: "task-form", onSubmit: addTask },
      React.createElement("input", {
        type: "text",
        placeholder: "New task...",
        value: title,
        onChange: e => setTitle(e.target.value),
        required: true
      }),
      React.createElement(
        "button",
        { className: "btn btn-add" },
        "Add"
      )
    ),

    loading
      ? React.createElement("p", null, "Loading...")
      : React.createElement(
          "ul",
          { className: "tasks" },
          sorted.map(task =>
            React.createElement(
              "li",
              { key: task.id, className: task.completed ? "completed" : "" },

              React.createElement("input", {
                type: "checkbox",
                checked: task.completed,
                onChange: e =>
                  toggleComplete(task.id, e.target.checked)
              }),

              React.createElement(
                "span",
                { className: "title" },
                task.title
              ),

              React.createElement(
                "button",
                {
                  className: "btn-small",
                  onClick: () => deleteTask(task.id)
                },
                "🗑"
              )
            )
          )
        )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(App)
);