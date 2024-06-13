export type TaskResponse =  {
  title: string;
  description: string;
  status: number;
}
export type LoginResponse =  {
  accessToken: string;
}
export type StatusCodeResponse = {
  message: string;
};
  export type Task = {
    id: string;
    title: string;
    description: string;
    status: "0" | "1" | "2";
  };
export type ErrorAlertProps = {
  message: string;
  onDismiss: () => void;
}
export type AlertProps =  {
  message: string;
  type: "update" | "delete" | "add" | "statusChange" | "login" | "logout";
}
export type LogLevel = "log" | "debug" | "info" | "warn" | "error";
export type LocationState = {
  message: string;
  showAlert: boolean;
  type?: "update" | "delete" | "add" | "statusChange" | "login" | "logout";
}
