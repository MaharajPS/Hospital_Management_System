package com.hospital.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DepartmentDto {
    private Long id;

    @NotBlank(message = "Department name is required")
    private String name;

    private String description;

    @NotNull(message = "Consultation fee is required")
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal consultationFee;
}
