package com.hospital.backend.dto;

import com.hospital.backend.enums.AppointmentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class AppointmentDto {
    private Long id;
    private UserDto patient;
    private UserDto doctor;
    private DepartmentDto department;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private AppointmentStatus status;
    private BigDecimal consultationFee;
    private LocalDateTime createdAt;
}
