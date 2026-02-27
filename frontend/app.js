// React-based frontend written by hand using CDN imports
// no build tools required, code intended to look like a human wrote it

const { useState, useEffect } = React;

const apiBase = "https://taskflow-fullstack-yb0m.onrender.com/api";

function authHeaders() {
  const token = localStorage.getItem("access");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function apiRequest(path, options = {}) {
  const res = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json().catch(() => null);
}

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showpassword, setShowPassword] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setUser({});
      loadTasks();
    }
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const list = await apiRequest('/tasks/');
      setTasks(list || []);
    } catch (e) {
      console.error('could not fetch', e);
    }
    setLoading(false);
  };

  const handleLogin = (u) => {
    setUser(u);
    loadTasks();
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setTasks([]);
  };

  return user ? (
    React.createElement(TaskArea, { tasks, loading, refresh: loadTasks, onLogout: handleLogout })
  ) : (
    React.createElement(LoginForm, { onLogin: handleLogin })
  );
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        await apiRequest('/accounts/register/', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        });
      }
      const data = await apiRequest('/accounts/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      onLogin({ username });
    } catch (err) {
      setError(isSignup ? 'Sign up failed' : 'Invalid credentials');
    }
  };

  return (
    React.createElement('form', { className: 'login-form', onSubmit: submit },
      React.createElement('h2', { className: 'form-title' }, isSignup ? 'Sign Up' : 'Login'),
      error && React.createElement('p', { className: 'error' }, error),
      React.createElement('input', {
        type: 'text', placeholder: 'Username', value: username,
        onChange: (e) => setUsername(e.target.value), required: true
      }),
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement('input', {
          type: showPassword ? 'text' : 'password',
          placeholder: 'Password',
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
          style: { width: '100%', paddingRight: '60px' }
       }),
        React.createElement('span', {
          onClick: () => setShowPassword(!showPassword),
          style: {
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#2a8fbd'
          }
        }, showPassword ? 'Hide' : 'Show')
      ),
      React.createElement('button', { className: 'btn' }, isSignup ? 'Create Account' : 'Login'),
      React.createElement('p', {
        className: 'toggle',
        onClick: () => setIsSignup((s) => !s)
      }, isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up")
    )
  );
}

function TaskArea({ tasks, loading, refresh, onLogout }) {
  const [newTitle, setNewTitle] = useState("");

  const add = async (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    await apiRequest('/tasks/', {
      method: 'POST',
      body: JSON.stringify({ title, description: '' }),
    });
    setNewTitle("");
    refresh();
  };

  const toggleComplete = async (id, completed) => {
    await apiRequest(`/tasks/${id}/`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    });
    refresh();
  };

  const remove = async (id) => {
    await fetch(`${apiBase}/tasks/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    refresh();
  };

  return (
    React.createElement('div', null,
      React.createElement('div', { id: 'header' },
        React.createElement('h1', null, 'TaskFlow'),
        React.createElement('button', { id: 'logout', onClick: onLogout }, 'Logout')
      ),
      React.createElement('form', { id: 'task-form', onSubmit: add },
        React.createElement('input', {
          type: 'text', placeholder: 'New task...', value: newTitle,
          onChange: (e) => setNewTitle(e.target.value), required: true
        }),
        React.createElement('button', { className: 'btn btn-add' }, 'Add')
      ),
      loading ? React.createElement('p', null, 'Loading…') :
        React.createElement(TaskList, { tasks, onToggle: toggleComplete, onDelete: remove })
    )
  );
}

function TaskList({ tasks, onToggle, onDelete }) {
  const sorted = [...tasks].sort((a, b) => a.completed - b.completed);
  return (
    React.createElement('ul', { key: 'list', className: 'tasks' },
      sorted.map(t => React.createElement(TaskItem, { key: t.id, task: t, onToggle, onDelete }))
    )
  );
}

function TaskItem({ task, onToggle, onDelete }) {
  return (
    React.createElement('li', { className: task.completed ? 'completed' : '' },
      React.createElement('input', {
        type: 'checkbox', checked: task.completed,
        onChange: (e) => onToggle(task.id, e.target.checked)
      }),
      React.createElement('span', { className: 'title' }, task.title),
      React.createElement('button', { className: 'btn-small', onClick: () => onDelete(task.id) }, '🗑')
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));