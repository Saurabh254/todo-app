import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { ErrorAlertProps } from "../type";



const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return (
    <div
      role="alert"
      className="alert alert-error fixed right-0 top-0 mt-4 mr-6  w-[30vw] flex items-center justify-center bg-orange-300 text-neutal p-4 shadow-lg z-50 animate-slide-in"
    >
      <svg
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="ml-2">{message}</span>
    </div>
  );
};

export function showAlert(message: string): void {
  const existingAlert = document.getElementById("alert-container");
  if (existingAlert) {
 
    document.body.removeChild(existingAlert);
  }
  const alertContainer = document.createElement("div");
  alertContainer.setAttribute("id", "alert-container");
  document.body.appendChild(alertContainer);
  const onDismiss = () => {
    
    document.body.removeChild(alertContainer);
  };
  ReactDOM.render(
    <ErrorAlert message={message} onDismiss={onDismiss} />,
    alertContainer
  );

}
export default ErrorAlert;
