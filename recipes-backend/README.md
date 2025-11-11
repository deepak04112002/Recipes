# Recipes Backend API

A Spring Boot REST API for managing and searching recipes with H2 in-memory database and Hibernate Search integration.

## Features

- Load recipes from external DummyJSON API
- Full-text search on recipe names and cuisines
- RESTful endpoints for recipe management
- Circuit breaker pattern for external API resilience
- Comprehensive error handling and validation
- Swagger/OpenAPI documentation
- H2 in-memory database with JPA
- Hibernate Search with Lucene backend

## Prerequisites

- Java 21
- Maven 3.6+

## Getting Started

### 1. Clone and Build

```bash
git clone <repository-url>
cd recipes-backend
mvn clean install
```

### 2. Run the Application

```bash
  mvn spring-boot:run
```
The application will start on ```http://localhost:8080```

### 3. Access Documentation
- Swagger UI: ```http://localhost:8080/swagger-ui.html```

- H2 Console: ```http://localhost:8080/h2-console```

   - JDBC URL: ```jdbc:h2:mem:recipedb```

   - Username: ```sa```

   - Password: ```password```

## API Endpoints

### Load Recipes
```bash
  POST /api/recipes/load
```
Loads all recipes from the external DummyJSON API into the local database.

### Search Recipes
```bash
  POST /api/recipes/search
Content-Type: application/json
{
  "query": "pasta"
}
```
Search recipes by name or cuisine (minimum 3 characters).

### Get Recipe by ID
```bash
  GET /api/recipes/{id}
```
Retrieve a specific recipe by its ID.

### Get All Recipes
```bash
  GET /api/recipes
```
Retrieve all recipes from the database.

### Configuration
Key configuration properties in ```application.properties```:

- ```recipes.external.api.url```: External API URL
- ```recipes.external.api.timeout```: API timeout duration
- ```resilience4j.circuitbreaker.*```: Circuit breaker settings

## Testing

Run tests with:
```bash
  mvn test 
```

Generate test coverage report:
```bash
  mvn jacoco:report
```

## Architecture
The application follows a layered architecture:

- Controller Layer: REST endpoints and request/response handling

- Service Layer: Business logic and orchestration

- Repository Layer: Data access with JPA

- Entity Layer: JPA entities with Hibernate Search annotations

- DTO Layer: Data transfer objects for external API integration

## Error Handling
Global exception handling provides consistent error responses:

- ```404 Not Found```: Recipe not found

- ```400 Bad Request```: Validation errors

- ```500 Internal Server Error```: Unexpected errors
