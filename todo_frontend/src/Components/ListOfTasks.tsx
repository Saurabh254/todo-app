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

const statusColor = {
  "0": "bg-red-500", 
  "1": "bg-yellow-500",
  "2": "bg-green-500", 
};

function getStatusColor(statusCode: "0" | "1" | "2"): string {
  return statusColor[statusCode] || "bg-gray-500";
}

function ListOfTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

 const [buttonClicked, setButtonClicked] = useState<Record<string, boolean>>(
   {}
 ); 
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
   const [expanded, setExpanded] = useState<Record<string, boolean>>({}); 
  const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadTasks = async () => {
         setIsLoading(true);  
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
        log("info", "Tasks fetched successfully:", fetchedTasks);
      } catch (error) {
        log("error", "There was a problem fetching tasks:", error);
      } finally {
        setIsLoading(false);
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
 const handleCombinedClick = async (taskId: string) => {
   setButtonClicked((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
   setIsLoading(true);

   setTimeout(async () => {
     try {
       await deleteTask(taskId);
       setTasks(tasks.filter((task) => task.id !== taskId));
       log("info", "Task deleted successfully:", taskId);
     } catch (error) {
       log("error", "There was a problem with the delete operation:", error);
     } finally {
       setIsLoading(false); 
       setButtonClicked((prev) => ({ ...prev, [taskId]: false }));
     }

   }, 1000); 
 };


  const handleAddNewTask = () => {
    navigate("/addnewTask");
  };
  const toggleDescription = (taskId: string) => {
    setExpanded((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };
const filteredTasks =
  selectedStatus === "all"
    ? tasks
    : tasks.filter((task) => String(task.status) === selectedStatus);


  return (
    <div className="w-screen h-screen bg-[#f3f1f1] overflow-y-scroll flex flex-col relative">
      {isLoading && (
        <progress className="progress w-full absolute top-0"></progress>
      )}
      <div className="m-5 flex flex-col md:flex-row justify-between items-center lg:w-[96%] w-0  h-80 lg:h-10 ">
        <div>
          <div className="pl-72 lg:pl-[38vw] relative">
            <h1 className="text-xl lg:text-2xl text-gray-700 font-bold w-64 lg:pl-16">
              Welcome back,
            </h1>
            <button
              className=" bg-red-500 text-white rounded  ml-64 block lg:hidden p-0.5 absolute top-0 right-0"
              onClick={handleLogout}
            >
              Logout
            </button>
            <p className="text-sm text-gray-700 lg:pl-2 font-semibold">
              You've got {filteredTasks.length} tasks coming up in the next
              days.{" "}
            </p>
          </div>
        </div>

        <div className="w-1/4 flex hidden lg:block">
          <button
            className="btn-sm bg-red-500 text-white rounded font-semibold ml-64"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className=" items-center flex justify-between lg:w-[49vw] ml-[25vw]">
        <div>
          <button
            className="btn-sm rounded-lg bg-gray-500 text-white opacity-80 font-medium lg:mx-2 hidden lg:block "
            onClick={handleAddNewTask}
          >
            Add Task.. <i className="ri-add-line text-md"></i>
          </button>
        </div>
        <div className="">
          <select
            className="select select-bordered select-sm text-sm bg-white border border-gray-800   text-start rounded-lg text-gray-800 "
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="all">All</option>
            <option value="0">To Do</option>
            <option value="1">In Progress</option>
            <option value="2">Done</option>
          </select>
        </div>
      </div>
      {filteredTasks.map((task, index) => (
        <div className="w-full items-center flex justify-center">
          <div
            key={index}
            className="border rounded-lg shadow bg-white  lg:ml-4 ml-2 my-2 lg:w-[49vw] w-[75vw] pr-3 pl-4 pt-2 pb-2"
          >
            <div className="flex flex-col md:flex-col">
              <div>
                <h4 className="text-gray-700 font-semibold text-lg">
                  {task.title}
                </h4>
                <p className="text-gray-700 text-sm pt-2">
                  {expanded[task.id]
                    ? task.description
                    : `${task.description.split(" ").slice(0, 10).join(" ")} `}
                  {task.description.split(" ").length > 30 && (
                    <button
                      onClick={() => toggleDescription(task.id)}
                      className="text-blue-600 text-xs"
                    >
                      {expanded[task.id] ? "Read less.." : "Read more.."}
                    </button>
                  )}
                </p>
              </div>
              <div className="flex">
                <button
                  className={` border border-0 border-gray-400 mt-2 text-white text-xs font-semibold rounded p-1 pl-2 pr-2 ${getStatusColor(
                    task.status
                  )}`}
                  type="button"
                >
                  {statusLabels[task.status]}
                </button>
                <div className="flex ml-auto">
                  <button
                    className="text-[#9e9ea7] text-xl mx-2"
                    onClick={() => handleEdit(task)}
                  >
                    <i className="ri-edit-line"></i>
                  </button>

                  <button
                    key={task.id}
                    className={`text-[#9e9ea7] ${
                      buttonClicked[task.id] ? "text-2xl" : "text-xl"
                    } mx-2`}
                    onClick={() => handleCombinedClick(task.id)}
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListOfTasks;
