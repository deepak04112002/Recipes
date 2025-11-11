import { render, screen, fireEvent } from "@testing-library/react";
import { SearchInput } from "../SearchInput";

describe("SearchInput", () => {
  const mockProps = {
    value: "",
    onChange: jest.fn(),
    onSearch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders search input", () => {
    render(<SearchInput {...mockProps} />);
    expect(screen.getByPlaceholderText(/search for delicious recipes/i)).toBeInTheDocument();
  });

  test("calls onSearch when enter pressed with valid input", () => {
    const mockOnSearch = jest.fn();
    render(<SearchInput {...mockProps} value="pasta" onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/search for delicious recipes/i);

    // Use the React synthetic event approach
    fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });
    expect(mockOnSearch).toHaveBeenCalled();
  });

  test("disables search with less than 3 characters", () => {
    render(<SearchInput {...mockProps} value="pa" />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  test("calls onChange when input changes", () => {
    render(<SearchInput {...mockProps} />);
    const input = screen.getByPlaceholderText(/search for delicious recipes/i);

    fireEvent.change(input, { target: { value: "chicken" } });
    expect(mockProps.onChange).toHaveBeenCalledWith("chicken");
  });

  test("shows minimum character message", () => {
    render(<SearchInput {...mockProps} value="ab" />);
    expect(screen.getByText("Type at least 3 characters to search")).toBeInTheDocument();
  });

  test("calls onSearch when search button clicked", () => {
    const mockOnSearch = jest.fn();
    render(<SearchInput {...mockProps} value="pasta" onSearch={mockOnSearch} />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(mockOnSearch).toHaveBeenCalled();
  });
});
