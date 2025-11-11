package com.recipes.recipes_backend.service;

import com.recipes.recipes_backend.entity.Recipe;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class SearchService {

    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<Recipe> searchRecipes(String query) {
        SearchSession searchSession = Search.session(entityManager);

        List<Recipe> recipes = searchSession.search(Recipe.class)
                .where(f -> f.bool()
                        .should(f.wildcard().field("name").matching("*" + query.toLowerCase() + "*"))
                        .should(f.wildcard().field("cuisine").matching("*" + query.toLowerCase() + "*"))
                )
                .fetchAllHits();

        // Force initialization of lazy collections
        recipes.forEach(recipe -> {
            Hibernate.initialize(recipe.getIngredients());
            Hibernate.initialize(recipe.getInstructions());
            Hibernate.initialize(recipe.getTags());
        });

        return recipes;
    }

    @Transactional
    public void indexAllRecipes() {
        SearchSession searchSession = Search.session(entityManager);
        try {
            searchSession.massIndexer(Recipe.class)
                    .startAndWait();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Indexing was interrupted", e);
        }
    }

    @Transactional(readOnly = true)
    public List<Recipe> getAllRecipesWithInitializedCollections() {
        List<Recipe> recipes = entityManager.createQuery("SELECT r FROM Recipe r", Recipe.class)
                .getResultList();

        // Force initialization of lazy collections
        recipes.forEach(recipe -> {
            Hibernate.initialize(recipe.getIngredients());
            Hibernate.initialize(recipe.getInstructions());
            Hibernate.initialize(recipe.getTags());
        });

        return recipes;
    }

}
