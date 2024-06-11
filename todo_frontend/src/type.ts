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
  id : string;
  title: string;
  description: string;
  status : string;
}
export type ErrorAlertProps = {
  message: string;
  onDismiss: () => void;
}