import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../Components/Protected";
const TestComponent = () => <div>Protected Content</div>;
describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks(); 
  });
  it("renders the child component for authenticated users", () => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue("fake-token");
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
  it("redirects to login page for unauthenticated users", () => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
