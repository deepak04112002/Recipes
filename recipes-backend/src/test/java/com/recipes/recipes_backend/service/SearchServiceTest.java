package com.recipes.recipes_backend.service;

import com.recipes.recipes_backend.entity.Recipe;
import jakarta.persistence.EntityManager;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.hibernate.search.mapper.orm.massindexing.MassIndexer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SearchServiceTest {

    @Mock
    private EntityManager entityManager;

    @Mock
    private SearchSession searchSession;

    @Mock
    private MassIndexer massIndexer;

    @InjectMocks
    private SearchService searchService;

    @BeforeEach
    void setUp() {
        Recipe.builder()
                .id(1L)
                .name("Pasta Recipe")
                .cuisine("Italian")
                .build();
    }

    @Test
    void indexAllRecipes_ShouldCompleteSuccessfully() throws InterruptedException {
        try (MockedStatic<Search> searchMock = mockStatic(Search.class)) {
            searchMock.when(() -> Search.session(entityManager)).thenReturn(searchSession);
            when(searchSession.massIndexer(Recipe.class)).thenReturn(massIndexer);
            doNothing().when(massIndexer).startAndWait();

            assertDoesNotThrow(() -> searchService.indexAllRecipes());

            verify(searchSession).massIndexer(Recipe.class);
            verify(massIndexer).startAndWait();
        }
    }
}
