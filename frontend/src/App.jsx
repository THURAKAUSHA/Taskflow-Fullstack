import { useState } from "react";
import TaskPage from "./pages/TaskPage";
import Login from "./pages/Login";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  return loggedIn ? (
    <TaskPage />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}

export default App;
