import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateTask } from "../api";
import { log } from "./Logger";
import Layout from "./Layout";

function EditTask() {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state.task;
  
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(String(task.status));
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     setIsLoading(true); 
     try {
       await updateTask(task.id, title, description, parseInt(status, 10));
       
       log("info", "Task updated successfully");
       navigate("/listOfTasks", {
         state: {
           message: "Task Updated Successfully",
           showAlert: true,
           type: "update",
         },
       });
     } catch (error) {
       log("error", "There was a problem with the update operation:", error);
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
        <div className="flex flex-col items-center justify-center mt-4  w-[50vw]">
          <div className="w-full flex flex-col items-center justify-center">
            <p className="text-md text-gray-700 font-semibold">
              Please , Edit Your Task for the completion{" "}
            </p>
          </div>
          <div className="border shadow p-3 bg-white rounded w-full  mt-4 flex flex-col items-center justify-center">
            <div className="">
              <h2 className="text-lg text-gray-800 font-semibold">
                Edit Title , Description , Status
              </h2>
            </div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <label className="text-gray-800 font-medium text-sm py-2 pt-3">
                Enter Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Type here"
                className="p-1 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label className="text-gray-800 font-medium py-2 text-sm">
                Enter Description
              </label>
              <textarea
                name="description"
                placeholder="Description"
                className="p-2 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                cols={60}
              ></textarea>

              <label className="text-gray-800 font-medium py-2 text-sm">
                Select Status
              </label>
              <select
                className="select select-bordered select-sm w-full max-w-xs bg-white border border-gray-800 text-gray-800 "
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="0">To Do</option>
                <option value="1">In Progress</option>
                <option value="2">Done</option>
              </select>

              <button
                className="text-sm  w-16 mt-3 py-1 bg-blue-500  text-white rounded"
                type="submit"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTask;
