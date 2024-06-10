import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTask } from "../api";
import { TaskResponse } from "../type";
import { log } from "./Logger";

function AddNewTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("0");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    let isValid = true;
    if (title.length < 3) {
      setTitleError("Title must be at least 3 characters.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (description.length < 5) {
      setDescriptionError("Description must be at least 5 characters.");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    return isValid;
  };

  useEffect(() => {
    if (submitted) {
      validateInputs();
    }
  }, [title, description, submitted]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true); 
    if (!validateInputs()) {
      return;
    }

    try {
      const numericStatus = parseInt(status, 10);
      const responseData: TaskResponse = await createTask(
        title,
        description,
        numericStatus
      );
      log("info", "Task created successfully:", responseData);
      navigate("/listOfTasks");
    } catch (error) {
      log("error", "There was a problem with creating the task:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleListOfTask = () => {
    navigate("/listOfTasks");
  };

  const isDisabled =
    !!titleError ||
    !!descriptionError ||
    title.length < 3 ||
    description.length < 5;

  return (
    <div className="w-screen h-screen bg-white overflow-y-scroll">
      <div className="m-5 flex justify-between items-center">
        <button
          className="btn-sm bg-blue-500 text-white rounded"
          onClick={handleListOfTask}
        >
          List Of Tasks
        </button>
        <div className="text-3xl font-bold text-gray-800 flex items-center justify-center">
          Add New Task Page
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
          <div className="py-2">
            <h2 className="text-3xl font-semibold text-gray-800">
              Create a New Task
            </h2>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="text-gray-800 font-medium py-2">
              Enter Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter the Title"
              className="p-2 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {submitted && titleError && (
              <div className="text-red-500 text-sm">{titleError}</div>
            )}

            <label className="text-gray-800 font-medium py-2">
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
            {submitted && descriptionError && (
              <div className="text-red-500 text-sm">{descriptionError}</div>
            )}

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
              disabled={isDisabled}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewTask;
