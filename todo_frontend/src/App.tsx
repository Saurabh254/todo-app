import { Routes, Route } from "react-router-dom";
import AddNewTask from "./Components/AddNewTask";
import Login from "./Components/Login";
import TaskLists from "./Components/TaskLists";
import EditTask from "./Components/EditTask";
import ProtectedRoute from "./Components/Protected";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/addnewTask"
          element={
            <ProtectedRoute>
              <AddNewTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listOfTasks"
          element={
            <ProtectedRoute>
              <TaskLists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editTask"
          element={
            <ProtectedRoute>
              <EditTask />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
