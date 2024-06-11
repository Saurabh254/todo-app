import axios from "axios";
import { apiClient } from "./apiClient";
import { APIERROR } from "./HandleStatusCode";
export const API_URL = "https://todoapi.saurabhvishwakarma.in/api/v1/users";
import { TaskResponse, LoginResponse, Task } from "./type";
import { log } from "./Components/Logger";

export async function createTask(
  title: string,
  description: string,
  status: number
): Promise<TaskResponse> {
  try {
    const response = await apiClient.post<TaskResponse>("/tasks/create_task", {
      title,
      description,
      status,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      APIERROR(error);
    } else {
      const errMsg =
        (error as Error).message ||
        "An unknown error occurred during OTP verification.";
      log("error", `Verification Error: ${errMsg}`);
      throw new Error(errMsg);
    }
  }
}

export async function login(
  phone: string,
  otp: string
): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>("/login", {
      phone,
      otp,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      APIERROR(error);
    } else {
      const errMsg =
        (error as Error).message ||
        "An unknown error occurred during chat message fetching.";
      log("error", errMsg);
      throw new Error(errMsg);
    }
  }
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await apiClient.get("/tasks?page=1&size=50");
    return response.data.items;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      APIERROR(error);
    } else {
      const errMsg =
        (error as Error).message ||
        "An unknown error occurred during chat message fetching.";
      log("error", errMsg);
      throw new Error(errMsg);
    }
  }
}

export async function updateTask(
  taskId: string,
  title: string,
  description: string,
  status: number
): Promise<Task> {
  try {
    const response = await apiClient.patch<Task>(`/tasks/${taskId}`, {
      title,
      description,
      status,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      APIERROR(error);
    } else {
      const errMsg =
        (error as Error).message ||
        "An error occurred while updating the task.";
      log("error", errMsg);
      throw new Error(errMsg);
    }
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      APIERROR(error);
    } else {
      const errMsg =
        (error as Error).message ||
        "There was a problem with the delete operation.";
      log("error", `Delete Task Error: ${errMsg}`);
      throw new Error(errMsg);
    }
  }
}
export async function fetchTasksByStatus(): Promise<Task[]> {
  try {
    const response = await apiClient.get(`/tasks?status=0&page=1&size=50`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log("error", "Axios error fetching tasks:", error.message);
      throw new Error("Failed to fetch tasks due to network or server issue.");
    } else {
      log("error", "Unexpected error fetching tasks:", error);
      throw new Error("An unexpected error occurred while fetching tasks.");
    }
  }
}
