import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { recipeService } from './services/recipeService';

// Mock axios completely to avoid ES module issues
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  })),
}));

// Mock the entire service module
jest.mock('./services/recipeService', () => ({
  recipeService: {
    loadRecipes: jest.fn(),
    searchRecipes: jest.fn(),
    getRecipeById: jest.fn(),
    getAllRecipes: jest.fn(),
  },
}));

const mockRecipeService = recipeService as jest.Mocked<typeof recipeService>;

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
    expect(screen.getByText('Load Recipe Data')).toBeInTheDocument();
  });

  test('loads data when button clicked', async () => {
    mockRecipeService.loadRecipes.mockResolvedValue('Success');
    render(<App />);
    
    fireEvent.click(screen.getByText('Load Recipe Data'));
    
    await waitFor(() => {
      expect(mockRecipeService.loadRecipes).toHaveBeenCalled();
    });
  });
});
