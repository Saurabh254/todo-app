
function AddNewTask() {
  return (
    <>
      <div className="w-screen h-screen bg-white">
        <div className="text-4xl font-bold text-gray-800 flex items-center justify-center pt-5">
          <button>Add New Task</button>
        </div>
        <div className="flex items-center justify-center mt-12">
          <div className="border shadow p-3  bg-white rounded pl-20 pr-20">
            <div className="py-2">
              <h2 className="text-3xl font-semibold text-gray-800 ">
                Create a New Task
              </h2>
            </div>
            <form className="flex flex-col">
              <label className="text-gray-800 font font-medium py-2">
                Enter Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Type here"
                className="p-2 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
              />

              <label className="text-gray-800 font font-medium py-2">
                Enter Description
              </label>
              <input
                type="text"
                name="description"
                placeholder="Description"
                className="p-2 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
              />

              <label className="text-gray-800 font font-medium py-2">
                Enter Status
              </label>
              <input
                type="text"
                name="status"
                placeholder="Status"
                className="p-2 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
              />
              
              <button className="btn-sm w-20 mt-5 bg-blue-500 text-white rounded">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddNewTask