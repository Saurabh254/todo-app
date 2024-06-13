import { AlertProps } from "../type";

function Alert({ message, type }: AlertProps) {
  const bgColor: Record<"update" | "delete" | "add" | "statusChange" | "login" | "logout", string> =
    {
      update: "bg-green-500",
      delete: "bg-red-500",
      add: "bg-blue-500",
      statusChange: "bg-yellow-500",
      login : "bg-green-500" , 
      logout : "bg-red-500" , 
    };

  return (
    <div
      role="alert"
      className={`alert alert-error fixed right-0 top-0 mt-4 mr-5 w-[20vw] flex items-center justify-center ${bgColor[type]} text-sm p-2 shadow-lg z-50 animate-slide-in text-white rounded-lg`}
    >
      <span className="ml-2">{message}</span>
    </div>
  );
}

export default Alert;
