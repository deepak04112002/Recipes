import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../ErrorBoundary";

const ThrowError = () => {
  throw new Error("Test error");
};

describe("ErrorBoundary", () => {
  test("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  test("renders error UI when error occurs", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("🔄 Refresh Page")).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
