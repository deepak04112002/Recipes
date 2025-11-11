package com.recipes.recipes_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI recipeOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Recipes API")
                        .description("REST API for managing and searching recipes")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Deepak")
                                .email("dmajhi286@gmail.com")));
    }
}
