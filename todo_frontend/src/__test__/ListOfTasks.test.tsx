import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskLists from "../Components/TaskLists";
import { fetchTasks } from "../api";

import { BrowserRouter } from "react-router-dom";

jest.mock("../api", () => ({
  fetchTasks: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () =>
    jest.fn().mockImplementation(() => ({
      navigate: jest.fn(),
    })),
}));
describe("ListOfTasks Component", () => {
  const tasks = [
    { id: "1", title: "Task 1", description: "Description 1" },
    { id: "2", title: "Task 2", description: "Description 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchTasks as jest.Mock).mockResolvedValue(tasks);
  });

  it("handles task deletion", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <TaskLists />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Delete");
    await user.click(deleteButtons[0]);
  });

  it("logs out and redirects correctly", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <TaskLists />
      </BrowserRouter>
    );
    const logoutButton = screen.getByText("Logout");
    await user.click(logoutButton);
  });
});
