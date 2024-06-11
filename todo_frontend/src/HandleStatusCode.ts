import { AxiosError } from "axios";
import { StatusCodeResponse } from "./type";
import { log } from "./Components/Logger";
import { showAlert } from "./Components/ErrorAlert";
export function APIERROR(error: AxiosError): never {
  const { response } = error;

  if (!response) {
    log("error", `Network error or no response: ${error.message}`);
    showAlert("Network error or no response");
    throw new Error("Network error or no response");
  }

  const statusCode = response.status;
  const data = response.data as StatusCodeResponse;
  const errorMessage = data.message || error.message;

  log("error", `HTTP ${statusCode}: ${errorMessage}`);
  log("info", "Error status code:", statusCode);

  if (statusCode === 500) {
    showAlert("Authentication Failed");
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  } else {
    showAlert(errorMessage);
    throw new Error(errorMessage);
  }

  throw new Error(errorMessage);
}
