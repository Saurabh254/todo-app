
import { render, screen, act } from "@testing-library/react";
import ErrorAlert from "../Components/ErrorAlert"; 
describe("ErrorAlert Component", () => {
  jest.useFakeTimers();

  it("displays the message and dismisses after a timeout", () => {
    const mockOnDismiss = jest.fn();

    render(
      <ErrorAlert message="Test error message" onDismiss={mockOnDismiss} />
    );

    const alertElement = screen.getByRole("alert");
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveTextContent("Test error message");

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it("should clean up the timeout on unmounting", () => {
    const mockOnDismiss = jest.fn();

    const { unmount } = render(
      <ErrorAlert message="Test error message" onDismiss={mockOnDismiss} />
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockOnDismiss).not.toHaveBeenCalled();
  });
});
