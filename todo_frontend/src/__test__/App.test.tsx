import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import "@testing-library/jest-dom";

jest.mock("../Components/Login", () => {
  return {
    __esModule: true,
    default: () => <div>Login Component</div>,
  };
});

jest.mock("../Components/AddNewTask", () => {
  return {
    __esModule: true,
    default: () => <div>AddNewTask Component</div>,
  };
});

jest.mock("../Components/ListOfTasks", () => {
  return {
    __esModule: true,
    default: () => <div>ListOfTasks Component</div>,
  };
});

jest.mock("../Components/EditTask", () => {
  return {
    __esModule: true,
    default: () => <div>EditTask Component</div>,
  };
});

jest.mock("../Components/Protected", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ), 
  };
});

describe("App Component Route Tests", () => {
  test("should render Login component for default route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Login Component")).toBeInTheDocument();
  });

  test("should render AddNewTask component for /addnewTask route", () => {
    render(
      <MemoryRouter initialEntries={["/addnewTask"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("AddNewTask Component")).toBeInTheDocument();
  });

  test("should render ListOfTasks component for /listOfTasks route", () => {
    render(
      <MemoryRouter initialEntries={["/listOfTasks"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("ListOfTasks Component")).toBeInTheDocument();
  });

  test("should render EditTask component for /editTask route", () => {
    render(
      <MemoryRouter initialEntries={["/editTask"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("EditTask Component")).toBeInTheDocument();
  });
});
