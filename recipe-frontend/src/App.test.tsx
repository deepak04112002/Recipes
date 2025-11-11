import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { recipeService } from './services/recipeService';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  })),
}));

jest.mock('./services/recipeService', () => ({
  recipeService: {
    loadRecipes: jest.fn(),
    searchRecipes: jest.fn(),
    getRecipeById: jest.fn(),
    getAllRecipes: jest.fn(),
  },
}));

const mockRecipeService = recipeService as jest.Mocked<typeof recipeService>;

const mockRecipes = [
  {
    id: 1,
    name: "Test Recipe",
    cuisine: "Italian",
    ingredients: ["ingredient1"],
    instructions: ["step1"],
    tags: ["tag1", "tag2"],
    cookTimeMinutes: 30,
    image: "test.jpg"
  }
];

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders recipe finder title', () => {
    render(<App />);
    expect(screen.getByText('🍳 Recipe Finder')).toBeInTheDocument();
  });

  test('shows load data button initially', () => {
    render(<App />);
    expect(screen.getByText('🚀 Load Recipe Data')).toBeInTheDocument();
  });

  test('loads data when button clicked', async () => {
    mockRecipeService.loadRecipes.mockResolvedValue('Success');
    mockRecipeService.getAllRecipes.mockResolvedValue(mockRecipes);
    
    render(<App />);
    
    fireEvent.click(screen.getByText('🚀 Load Recipe Data'));
    
    await waitFor(() => {
      expect(mockRecipeService.loadRecipes).toHaveBeenCalled();
      expect(mockRecipeService.getAllRecipes).toHaveBeenCalled();
    });
  });

  test('handles load data error', async () => {
    mockRecipeService.loadRecipes.mockRejectedValue(new Error('Load failed'));
    
    render(<App />);
    
    fireEvent.click(screen.getByText('🚀 Load Recipe Data'));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load recipe data. Please try again.')).toBeInTheDocument();
    });
  });

  test('performs search after data loaded', async () => {
    mockRecipeService.loadRecipes.mockResolvedValue('Success');
    mockRecipeService.getAllRecipes.mockResolvedValue(mockRecipes);
    mockRecipeService.searchRecipes.mockResolvedValue(mockRecipes);
    
    render(<App />);
    
    // Load data first
    fireEvent.click(screen.getByText('🚀 Load Recipe Data'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search for delicious recipes/i)).toBeInTheDocument();
    });

    // Search
    const input = screen.getByPlaceholderText(/search for delicious recipes/i);
    fireEvent.change(input, { target: { value: 'pasta' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(mockRecipeService.searchRecipes).toHaveBeenCalledWith('pasta');
    });
  });

  test('handles search error', async () => {
    mockRecipeService.loadRecipes.mockResolvedValue('Success');
    mockRecipeService.getAllRecipes.mockResolvedValue(mockRecipes);
    mockRecipeService.searchRecipes.mockRejectedValue(new Error('Search failed'));
    
    render(<App />);
    
    // Load data first
    fireEvent.click(screen.getByText('🚀 Load Recipe Data'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search for delicious recipes/i)).toBeInTheDocument();
    });

    // Search with error
    const input = screen.getByPlaceholderText(/search for delicious recipes/i);
    fireEvent.change(input, { target: { value: 'pasta' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('Search failed')).toBeInTheDocument();
    });
  });

  test('resets recipes when search query cleared', async () => {
    mockRecipeService.loadRecipes.mockResolvedValue('Success');
    mockRecipeService.getAllRecipes.mockResolvedValue(mockRecipes);
    
    render(<App />);
    
    // Load data first
    fireEvent.click(screen.getByText('🚀 Load Recipe Data'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search for delicious recipes/i)).toBeInTheDocument();
    });

    // Clear search
    const input = screen.getByPlaceholderText(/search for delicious recipes/i);
    fireEvent.change(input, { target: { value: '' } });

    expect(input).toHaveValue('');
  });

  test('opens recipe modal when recipe clicked', async () => {
    mockRecipeService.loadRecipes.mockResolvedValue('Success');
    mockRecipeService.getAllRecipes.mockResolvedValue(mockRecipes);
    
    render(<App />);
    
    // Load data first
    fireEvent.click(screen.getByText('🚀 Load Recipe Data'));
    
    await waitFor(() => {
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });

    // Click recipe to open modal
    fireEvent.click(screen.getByText('Test Recipe'));
    
    await waitFor(() => {
      expect(screen.getAllByText('Test Recipe')).toHaveLength(2);
    });
  });
});
