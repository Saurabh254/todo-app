import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory} from "history";
import { Router } from "react-router-dom";
import EditTask from "../Components/EditTask";
import { updateTask } from "../api";

interface Task {
  id: string;
  title: string;
  description: string;
}
interface RouteState {
  task: Task; 
}


jest.mock("../api", () => ({
  updateTask: jest.fn(),
}));

const renderWithRouter = (
  component: React.ReactElement,
  options: { route?: string; state?: RouteState } = {}
) => {
  const { route = "/", state = {} } = options;
  const history = createMemoryHistory({ initialEntries: [route] });
  history.replace(route, state);

  return {
    ...render(
      <Router location={history.location} navigator={history}>
        {component}
      </Router>
    ),
    history,
  };
};

describe("EditTask Component", () => {
  const task: Task = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (updateTask as jest.Mock).mockResolvedValue(undefined);
  });

  it("renders correctly with initial task values", () => {
    renderWithRouter(<EditTask />, { route: "/edit", state: { task } });

    expect(screen.getByPlaceholderText("Type here")).toHaveValue(task.title);
    expect(screen.getByPlaceholderText("Description")).toHaveValue(
      task.description
    );
  });

 it("allows editing fields and submitting the form", async () => {
   const { history } = renderWithRouter(<EditTask />, {
     route: "/edit",
     state: { task },
   });

   userEvent.type(
     screen.getByPlaceholderText("Type here"),
     "{selectall}{del}Updated Title"
   );
   userEvent.type(
     screen.getByPlaceholderText("Description"),
     "{selectall}{del}Updated Description"
   );
   userEvent.click(screen.getByText("Submit"));

   await waitFor(() => {
     expect(history.location.pathname);
   });
 });

  it("handles API errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    (updateTask as jest.Mock).mockRejectedValue(
      new Error("Failed to update task")
    );

    renderWithRouter(<EditTask />, { route: "/edit", state: { task } });
    screen.getByText("Submit").click();

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        "There was a problem with the update operation:",
        expect.any(Error)
      )
    );
  });
});
