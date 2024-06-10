import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTasks, deleteTask } from "../api";
import { Task } from "../type";
import "remixicon/fonts/remixicon.css";
import { log } from "./Logger";

const statusLabels: { [key: string]: string } = {
  all: "All",
  "0": "To Do",
  "1": "In Progress",
  "2": "Done",
};

function ListOfTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all"); 
  const navigate = useNavigate();

 useEffect(() => {
   const loadTasks = async () => {
     try {
       const fetchedTasks = await fetchTasks();
       setTasks(fetchedTasks);
       log("info", "Tasks fetched successfully:", fetchedTasks);
     } catch (error) {
       log("error", "There was a problem fetching tasks:", error); 
       setError("Failed to load tasks.");
     }
   };

   loadTasks();
 }, []);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleEdit = (task: Task) => {
    navigate("/editTask", { state: { task } });
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
      console.log("Task deleted successfully:", taskId);
    } catch (error) {
      console.error("There was a problem with the delete operation:", error);
      setError("Failed to delete the task.");
    }
  };

  const handleAddNewTask = () => {
    navigate("/addnewTask");
  };

  const filteredTasks =
    selectedStatus === "all"
      ? tasks
      : tasks.filter((task) => String(task.status) === selectedStatus);

  return (
    <div className="w-screen h-screen bg-white overflow-y-scroll">
      <div className="m-5 flex justify-between items-center">
        <div>
          <select
            className="select select-bordered select-sm bg-white border border-gray-800 px-40  text-start rounded text-gray-800 pl-[8px]"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="all">All</option>
            <option value="0">To Do</option>
            <option value="1">In Progress</option>
            <option value="2">Done</option>
          </select>
        </div>
        <div className="text-gray-800 text-3xl font-bold">
          <h1>List Of Task</h1>
        </div>
        <div>
          <button
            className="btn-sm bg-blue-500 text-white rounded lg:mx-2 "
            onClick={handleAddNewTask}
          >
            Add New Task
          </button>
          <button
            className="btn-sm bg-red-500 text-white rounded mx-2 "
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {filteredTasks.map((task, index) => (
        <div key={index} className="border rounded shadow bg-white p-4 m-5">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-gray-700 font-semibold">
                <span className="font-bold">Title :</span> {task.title}
              </h4>
              <p className="text-gray-700 font-medium">
                <span className="font-bold">Description:</span>
                {task.description}
              </p>
              <p className="text-gray-700 font-medium">
                <span className="font-bold">Status:</span>{" "}
                {statusLabels[String(task.status)]}
              </p>
            </div>
            <div className="flex items-center">
              <button
                className="btn-sm bg-blue-500 text-white rounded mx-2"
                onClick={() => handleEdit(task)}
              >
                Edit
              </button>
              <button
                className="btn-sm bg-red-500 text-white rounded mx-2"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListOfTasks;
