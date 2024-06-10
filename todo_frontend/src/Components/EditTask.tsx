import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateTask } from "../api";
import { log } from "./Logger";

function EditTask() {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state.task;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(String(task.status));

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     try {
       await updateTask(task.id, title, description, parseInt(status, 10));
       log("info", "Task updated successfully");
       navigate("/listOfTasks");
     } catch (error) {
       log("error", "There was a problem with the update operation:", error);
     }
   };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleListOfTask = () => {
    navigate("/listOfTasks");
  };
  return (
    <div className="w-screen h-screen bg-white overflow-y-scroll">
      <div className="m-5 flex justify-between items-center">
        <button
          className="btn-sm bg-blue-500 text-white rounded"
          onClick={handleListOfTask}
        >
          List Of Task
        </button>
        <div className="text-3xl font-bold text-gray-800 flex items-center justify-center">
          <button>Edit Task Page</button>
        </div>
        <button
          className="btn-sm bg-red-500 text-white rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="flex items-center justify-center mt-4">
        <div className="border shadow p-3 bg-white rounded pl-20 pr-20">
          <div className="flex items-center justify-center">
            <h2 className="text-3xl font-semibold text-gray-800">
              Edit The Task
            </h2>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="text-gray-800 font-medium py-2">
              Enter Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Type here"
              className="p-2 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label className="text-gray-800 font-medium py-2">
              Enter Description
            </label>
            <textarea
              name="description"
              placeholder="Description"
              className="p-2 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={7}
              cols={50}
            ></textarea>

            <label className="text-gray-800 font-medium py-2">
              Select Status
            </label>
            <select
              className="select select-bordered select-sm w-full max-w-xs bg-white border border-gray-800 text-gray-800"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="0">To Do</option>
              <option value="1">In Progress</option>
              <option value="2">Done</option>
            </select>

            <button
              className="btn-sm w-20 mt-5 bg-blue-500 text-white rounded"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTask;
