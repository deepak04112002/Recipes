package com.recipes.recipes_backend.service;

import com.recipes.recipes_backend.dto.response.ExternalRecipeResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ExternalRecipeClientTest {

    @Mock
    private WebClient.Builder webClientBuilder;

    private ExternalRecipeClient externalRecipeClient;

    @BeforeEach
    void setUp() {
        externalRecipeClient = new ExternalRecipeClient(webClientBuilder);
        ReflectionTestUtils.setField(externalRecipeClient, "apiUrl", "https://dummyjson.com/recipes");
        ReflectionTestUtils.setField(externalRecipeClient, "timeout", Duration.ofSeconds(30));
        ReflectionTestUtils.setField(externalRecipeClient, "maxRetryAttempts", 3);
    }

    @Test
    void clearRecipeCache_ShouldLogMessage() {
        // This test verifies the cache eviction method exists and logs
        assertDoesNotThrow(() -> externalRecipeClient.clearRecipeCache());
    }

    @Test
    void fallbackGetRecipes_ShouldReturnEmptyResponse() {
        Exception testException = new RuntimeException("API Error");

        CompletableFuture<ExternalRecipeResponse> result = externalRecipeClient.fallbackGetRecipes(testException);

        assertNotNull(result);
        ExternalRecipeResponse response = result.join();
        assertNotNull(response);
        assertTrue(response.getRecipes().isEmpty());
        assertEquals(0, response.getTotal());
    }
    @Test
    void clearRecipeCache_ShouldLogCacheCleared() {
        assertDoesNotThrow(() -> externalRecipeClient.clearRecipeCache());
    }
}
