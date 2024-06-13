import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { createTask } from "../api";
import { TaskResponse } from "../type";
import { log } from "./Logger";
import Layout from "./Layout";

function AddNewTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("0");
 
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
   
     setIsLoading(true);

    try {
      const numericStatus = parseInt(status, 10);
      const responseData: TaskResponse = await createTask(
        title,
        description,
        numericStatus
      );
      log("info", "Task created successfully:", responseData);
      navigate("/listOfTasks", {
        state: { message: "New Task Added Successfully", showAlert: true, type: "add" },
      });
    } catch (error) {
      log("error", "There was a problem with creating the task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#f3f1f1] overflow-y-scroll">
      <Layout />
      {isLoading && (
        <progress className="progress w-full absolute top-0"></progress>
      )}

      <div className="w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mt-4 w-[50vw]">
          <div className="w-full flex flex-col items-center justify-center">
            <p className="text-gray-700 font-semibold text-md ">
              Please Create A New Task{" "}
            </p>
          </div>

          <div className="border shadow p-3 bg-white rounded   mt-2 w-full flex flex-col items-center justify-center">
            <div className="py-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Create a New Task
              </h2>
            </div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <label className="text-gray-800 font-medium py-2 text-sm">
                Enter Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter the Title"
                className="p-1 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label className="text-gray-800 font-medium py-2 text-sm">
                Enter Description
              </label>
              <textarea
                name="description"
                placeholder="Enter The Description"
                className="p-2 border-gray-800 border rounded w-full max-w-xs bg-white text-black h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                cols={50}
              ></textarea>

              <label className="text-gray-800 font-medium py-2 text-sm">
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
                className="text-xs  w-20 mt-3 py-1.5 bg-blue-500  text-white rounded"
                type="submit"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewTask;
