package com.recipes.recipes_backend.service;

import com.recipes.recipes_backend.dto.response.ExternalRecipeResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.Collections;
import java.util.concurrent.CompletableFuture;

@RequiredArgsConstructor
@Service
@Slf4j
public class ExternalRecipeClient {

    private final WebClient.Builder webClientBuilder;

    @Value("${recipes.external.api.url}")
    private String apiUrl;

    @Value("${recipes.external.api.timeout:30s}")
    private Duration timeout;

    @Value("${recipes.external.api.retry.max-attempts:3}")
    private int maxRetryAttempts;

    @CircuitBreaker(name = "recipeService", fallbackMethod = "fallbackGetRecipes")
    @Retry(name = "recipeService")
    @TimeLimiter(name = "recipeService")
    @Cacheable(value = "recipes", unless = "#result.recipes.isEmpty()")
    public CompletableFuture<ExternalRecipeResponse> fetchAllRecipes() {
        log.info("Fetching recipes from external API: {}", apiUrl);

        return webClientBuilder
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build()
                .get()
                .uri(apiUrl)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("API Error: " + response.statusCode() + " - " + body)))
                .bodyToMono(ExternalRecipeResponse.class)
                .retryWhen(reactor.util.retry.Retry.backoff(maxRetryAttempts, Duration.ofSeconds(1))
                        .filter(throwable -> !(throwable instanceof WebClientResponseException.BadRequest)))
                .timeout(timeout)
                .doOnSuccess(response -> log.info("Successfully fetched {} recipes",
                        response.getRecipes() != null ? response.getRecipes().size() : 0))
                .doOnError(error -> log.error("Error fetching recipes: {}", error.getMessage()))
                .toFuture();
    }

    @CacheEvict(value = "recipes", allEntries = true)
    public void clearRecipeCache() {
        log.info("Recipe cache cleared");
    }

    public CompletableFuture<ExternalRecipeResponse> fallbackGetRecipes(Exception ex) {
        log.warn("Circuit breaker activated, returning empty response: {}", ex.getMessage());
        ExternalRecipeResponse fallbackResponse = new ExternalRecipeResponse();
        fallbackResponse.setRecipes(Collections.emptyList());
        fallbackResponse.setTotal(0);
        return CompletableFuture.completedFuture(fallbackResponse);
    }
}
