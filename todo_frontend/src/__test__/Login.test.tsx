import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Login from "../Components/Login";
import { login as mockLogin } from "../api";

jest.mock("../api", () => ({
  login: jest.fn(),
}));

const history = createMemoryHistory();

const setup = () =>
  render(
    <Router location={history.location} navigator={history}>
      <Login />
    </Router>
  );

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    setup();
   
    expect(screen.getByPlaceholderText("Phone")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("OTP")).toBeInTheDocument();
  });

  it("validates inputs before submitting", async () => {
    setup();
    const submitButton = screen.getByRole("button", { name: "Submit" });

    userEvent.click(submitButton);

    


    userEvent.type(screen.getByPlaceholderText("Phone"), "12345");
    userEvent.click(submitButton);
    
  });

  it("submits the form with valid data", async () => {
    (mockLogin as jest.Mock).mockResolvedValue({
      accessToken: "fake_access_token",
    });

    setup();
    userEvent.type(screen.getByPlaceholderText("Phone"), "1234567890");
    userEvent.type(screen.getByPlaceholderText("OTP"), "456789");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    fireEvent.click(submitButton);

    
  });

  it("displays error messages from the API", async () => {
    (mockLogin as jest.Mock).mockRejectedValue(
      new Error("Invalid credentials")
    );

    setup();
    userEvent.type(screen.getByPlaceholderText("Phone"), "1234567890");
    userEvent.type(screen.getByPlaceholderText("OTP"), "456789");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    fireEvent.click(submitButton);

   
  });
});
