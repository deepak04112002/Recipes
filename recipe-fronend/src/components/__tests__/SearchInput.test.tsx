import { render, screen, fireEvent } from "@testing-library/react";
import { SearchInput } from "../SearchInput";

describe("SearchInput", () => {
  const mockProps = {
    value: "",
    onChange: jest.fn(),
    onSearch: jest.fn(),
  };

  test("renders search input", () => {
    render(<SearchInput {...mockProps} />);
    expect(screen.getByPlaceholderText(/search recipes/i)).toBeInTheDocument();
  });

  test("calls onSearch when enter pressed with valid input", () => {
    render(<SearchInput {...mockProps} value="pasta" />);
    const input = screen.getByPlaceholderText(/search recipes/i);

    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockProps.onSearch).toHaveBeenCalled();
  });

  test("disables search with less than 3 characters", () => {
    render(<SearchInput {...mockProps} value="pa" />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
