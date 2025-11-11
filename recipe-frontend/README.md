# Recipe Finder Frontend

A React TypeScript application for searching and browsing recipes with responsive design and client-side filtering.

## Features

- 🔍 **Global Search**: Google-like search bar for recipes by name/cuisine
- 🏷️ **Client-side Filtering**: Filter by tags without backend calls
- 📊 **Client-side Sorting**: Sort by cook time or name (asc/desc)
- 📱 **Responsive Design**: Mobile-first responsive layout
- ⚡ **Lazy Loading**: Optimized image loading
- 🧪 **Unit Testing**: Comprehensive test coverage
- 🎨 **Atomic Design**: Modular component architecture

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Jest & React Testing Library** for testing
- **Bun** as package manager

## Prerequisites

- Node.js 16+
- Bun package manager
- Backend API running on port 8080

## Installation

```bash
git clone <repository-url>
cd recipes-frontend
```

## Install dependencies

```bash
bun install
```

## Start development server

```bash
bun start
```

## Usage

1. **Load Recipe Data**
    - Click "Load Recipe Data" button on first visit

    - This fetches recipes from external API and stores in backend database

    - Only needs to be done once

2. **Search Recipes**
    - Enter 3+ characters in the search bar

    - Search by recipe name (e.g., "pasta", "chicken")

    - Search by cuisine (e.g., "Italian", "Asian")

    - Press Enter or click Search button

3. **Filter & Sort Results**
    - **Sort**: Choose cook time or name (ascending/descending)

    - **Filter**: Click tag buttons to filter by recipe tags

    - All filtering/sorting happens client-side (no API calls)

4. View Recipe Details
    - Click any recipe card to see full details

    - Shows ingredients, instructions, cook time, and tags

# Project Structure

```bash
src/
├── components/          # Atomic design components
│   ├── SearchInput.tsx  # Search input atom
│   ├── RecipeCard.tsx   # Recipe card atom
│   ├── FilterControls.tsx # Filter controls molecule
│   ├── RecipeGrid.tsx   # Recipe grid organism
│   └── ErrorBoundary.tsx # Error boundary
├── services/           # API services
│   └── recipeService.ts # Backend API calls
├── types/             # TypeScript definitions
│   └── Recipe.ts      # Recipe interfaces
└── __tests__/         # Test files
```

## API Integration

The frontend integrates with these backend endpoints:

- ```POST /api/recipes/load``` - Load external recipe data

- ```POST /api/recipes/search``` - Search recipes by query

- ```GET /api/recipes/{id}``` - Get specific recipe

- ```GET /api/recipes``` - Get all recipes

## Environment Configuration

Create .env file:

```bash
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_SEARCH_MIN_LENGTH=3
REACT_APP_REQUEST_TIMEOUT=10000
```

## Development

Available Scripts

```bash
# Start development server
bun start

# Run tests
bun test

# Run tests with coverage
bun run test:coverage

# Build for production
bun run build
```

Testing

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Generate coverage report
bun run test:coverage
```

## Performance Features

- **Lazy Loading**: Images load only when visible

- **Client-side Operations**: Sorting/filtering without API calls

- **Memoized Computations**: Optimized re-renders

- **Responsive Images**: Optimized for different screen sizes

- **Error Boundaries**: Graceful error handling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Architecture Patterns

### Atomic Design

- **Atoms**: SearchInput, RecipeCard
- **Molecules**: FilterControls
- **Organisms**: RecipeGrid
- **Templates**: App layout

### State Management

- React hooks for local state
- Memoization for performance
- Error boundaries for reliability

### API Layer

- Axios for HTTP requests
- Custom response handling
- Environment-based configuration
- Timeout and error handling

## Deployment

### Production Build

```bash
# Create production build
bun run build

# Serve build locally (optional)
npx serve -s build
```

### Environment Variables

Set these in production:

```env
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
REACT_APP_SEARCH_MIN_LENGTH=3
REACT_APP_REQUEST_TIMEOUT=10000
```

## Troubleshooting

### Common Issues

#### Search not working

- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify data is loaded first

#### No results found

- Try different search terms
- Ensure minimum 3 characters
- Check if data was loaded successfully

#### Styling issues

- Ensure Tailwind CSS is properly configured
- Check postcss.config.js exists
- Verify tailwind.config.js content paths

### Debug Mode

Add debug logs by setting:

```bash
console.log('Debug mode enabled');
```

## Contributing

1. Fork the repository
2. Create feature branch (git checkout -b feature/amazing-feature)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing-feature)
5. Open Pull Request

### Code Standards

- Use TypeScript strictly
- Follow atomic design principles
- Write tests for new components
- Use Tailwind for styling
- Handle errors gracefully

### License

This project is licensed under the MIT License.

### Support

For support, please contact dmajhi286@gmail.com or create an issue in the repository.
