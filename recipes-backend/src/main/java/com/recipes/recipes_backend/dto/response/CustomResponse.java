package com.recipes.recipes_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomResponse <T> {
    private int status;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private boolean success;

    public static <T> CustomResponse<T> success(T data, String message) {
        return CustomResponse.<T>builder()
                .status(200)
                .message(message)
                .data(data)
                .success(true)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> CustomResponse<T> error(int status, String message) {
        return CustomResponse.<T>builder()
                .status(status)
                .message(message)
                .success(false)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
