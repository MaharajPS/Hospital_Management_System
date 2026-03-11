package com.hospital.backend.controller;

import com.hospital.backend.dto.AnalyticsReportDto;
import com.hospital.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/appointments-per-doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnalyticsReportDto>> getAppointmentsPerDoctor() {
        return ResponseEntity.ok(analyticsService.getAppointmentsPerDoctor());
    }

    @GetMapping("/revenue-per-department")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnalyticsReportDto>> getRevenuePerDepartment() {
        return ResponseEntity.ok(analyticsService.getRevenuePerDepartment());
    }

    @GetMapping("/daily-appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnalyticsReportDto>> getDailyAppointments() {
        return ResponseEntity.ok(analyticsService.getDailyAppointmentCount());
    }

    @GetMapping("/top-doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnalyticsReportDto>> getTopDoctors() {
        return ResponseEntity.ok(analyticsService.getTopDoctorsByAppointments());
    }
}
