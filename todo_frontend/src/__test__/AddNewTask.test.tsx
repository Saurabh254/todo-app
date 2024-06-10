import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import AddNewTask from "../Components/AddNewTask";
import { createTask } from "../api";

jest.mock("../api", () => ({
  createTask: jest.fn(),
}));

jest.mock("../Components/Logger", () => ({
  log: jest.fn(),
}));

describe("AddNewTask Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(
      <BrowserRouter>
        <AddNewTask />
      </BrowserRouter>
    );
    expect(screen.getByText("Create a New Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter the Title")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter The Description")
    ).toBeInTheDocument();
  });

  it("handles input changes", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AddNewTask />
      </BrowserRouter>
    );
    await user.type(
      screen.getByPlaceholderText("Enter the Title"),
      "New Task Title"
    );
    await user.type(
      screen.getByPlaceholderText("Enter The Description"),
      "New Task Description"
    );
  });

  it("validates inputs and displays errors", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AddNewTask />
      </BrowserRouter>
    );
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await user.click(submitButton);


    await user.type(screen.getByPlaceholderText("Enter the Title"), "Short");
    await user.type(
      screen.getByPlaceholderText("Enter The Description"),
      "Too short"
    );
    await user.click(submitButton);

    expect(
      screen.getByText("Title must be at least 3 characters.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Description must be at least 5 characters.")
    ).toBeInTheDocument();
  });

  it("submits the form correctly", async () => {
    const user = userEvent.setup();
    (createTask as jest.Mock).mockResolvedValue({
      id: "123",
      title: "Valid New Task",
      description: "Valid description with enough length",
    });

    render(
      <BrowserRouter>
        <AddNewTask />
      </BrowserRouter>
    );

    const titleInput = screen.getByPlaceholderText("Enter the Title");
    const descriptionInput = screen.getByPlaceholderText("Enter The Description");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await user.type(titleInput, "Valid New Task");
    await user.type(descriptionInput, "Valid description with enough length");
    await user.click(submitButton);

    expect(createTask).toHaveBeenCalledWith(
      "Valid New Task",
      "Valid description with enough length",
      0  
    );
})
});
