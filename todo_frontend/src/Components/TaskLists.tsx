import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchTasks, deleteTask, updateTask } from "../api";
import { Task, LocationState } from "../type";
import Alert from "./Alert";
import "remixicon/fonts/remixicon.css";
import { log } from "./Logger";
import Layout from "./Layout";

const statusLabels: { [key: string]: string } = {
  all: "All",
  "0": "To Do",
  "1": "In Progress",
  "2": "Done",
};

const statusColor = {
  "0": "bg-gray-500",
  "1": "bg-yellow-500",
  "2": "bg-green-500",
};

function getStatusColor(statusCode: "0" | "1" | "2"): string {
  return statusColor[statusCode] || "bg-gray-500";
}

function TaskLists() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [buttonClicked, setButtonClicked] = useState<Record<string, boolean>>(
    {}
  );
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const [alertType, setAlertType] = useState<
    "update" | "delete" | "add" | "statusChange" | "login" | "logout"
  >("update");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const customState = location.state as LocationState;
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
  useEffect(() => {
    if (customState?.showAlert) {
      setShowAlert(true);
      setAlertMessage(customState.message);
      setAlertType(customState.type || "update");

      setTimeout(() => {
        setShowAlert(false);
        navigate(location.pathname, { replace: true, state: {} });
      }, 3000);
    }
  }, [location]);
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleEdit = (task: Task) => {
    navigate("/editTask", { state: { task } });
  };

  const handleCombinedClick = async (taskId: string) => {
    setButtonClicked((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
    setIsLoading(true);

    setTimeout(async () => {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter((task) => task.id !== taskId));
        setAlertMessage("Task Deleted Successfully");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        setAlertType("delete");
        log("info", "Task deleted successfully:", taskId);
      } catch (error) {
        log("error", "There was a problem with the delete operation:", error);
      } finally {
        setIsLoading(false);
        setButtonClicked((prev) => ({ ...prev, [taskId]: false }));
      }
    }, 1000);
  };
  const handleStatusChanges = async (taskId: string, newStatus: string) => {
    setIsLoading(true);
    const currentTask = tasks.find((task) => task.id === taskId);
    if (!currentTask) {
      log("error", "Task not found");
      setIsLoading(false);
      return;
    }

    try {
      const updatedTask = await updateTask(
        taskId,
        currentTask.title,
        currentTask.description,
        parseInt(newStatus)
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, status: newStatus as "0" | "1" | "2" }
            : task
        )
      );
      setAlertMessage("Status Changed Succesfully");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setAlertType("statusChange");
      log("info", "Task updated successfully:", updatedTask);
    } catch (error) {
      log("error", "Failed to update task status:", error);
    } finally {
      setIsLoading(false);
    }
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
    <div className="w-screen h-screen bg-[#f3f1f1] overflow-y-scroll overflow-x-hidden flex flex-col relative">
      {isLoading && (
        <progress className="progress w-full absolute top-0"></progress>
      )}
      {showAlert && <Alert message={alertMessage} type={alertType} />}
      <Layout />
      <div className="flex flex-col  justify-between items-center ">
        <div>
          <div>
            <h1 className="text-xl lg:text-2xl text-gray-700 font-bold w-64 lg:pl-16">
              Welcome back,
            </h1>

            <p className="text-sm text-gray-700 lg:pl-2 font-semibold">
              You've got {filteredTasks.length} tasks coming up in the next
              days.{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="w-screen flex flex-col items-center justify-center ">
        <div className=" w-[50vw] ">
          <div className="w-full flex justify-between items-center">
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
            <button
              className="rounded-lg bg-blue-500 text-white opacity-80 font-medium pl-2 pr-2 py-1 text-sm "
              onClick={handleAddNewTask}
            >
              Add Task.. <i className="ri-add-line text-md"></i>
            </button>
          </div>
          <div className="w-full">
            {filteredTasks.length === 0 ? (
              <div className="flex justify-center items-center mt-10">
                <h3 className="text-lg text-gray-600">
                  There are no more tasks of this status. 
                </h3>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <div className="">
                  <div
                    key={index}
                    className="border rounded-lg shadow bg-white   my-2  pr-3 pl-4 pt-2 pb-2"
                  >
                    <div className="flex flex-col md:flex-col relative">
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="text-gray-700 font-semibold text-lg">
                            {task.title}
                          </h4>
                          <select
                            className="select select-bordered select-sm text-xs bg-white border border-gray-800 text-start rounded-lg text-gray-800"
                            value={task.status.toString()}
                            onChange={(e) =>
                              handleStatusChanges(task.id, e.target.value)
                            }
                          >
                            <option value="0">To Do</option>
                            <option value="1">In Progress</option>
                            <option value="2">Done</option>
                          </select>
                        </div>
                        <p className="text-gray-700 text-sm pt-2">
                          {expanded[task.id]
                            ? task.description
                            : `${task.description
                                .split(" ")
                                .slice(0, 10)
                                .join(" ")} `}
                          {task.description.split(" ").length > 30 && (
                            <button
                              onClick={() => toggleDescription(task.id)}
                              className="text-blue-600 text-xs"
                            >
                              {expanded[task.id]
                                ? "Read less.."
                                : "Read more.."}
                            </button>
                          )}
                        </p>
                      </div>
                      <div className="flex">
                        <span
                          className={` border border-0 border-gray-400 mt-2 text-white text-xs font-semibold rounded p-1 pl-2 pr-2 ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {statusLabels[task.status]}
                        </span>
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskLists;
