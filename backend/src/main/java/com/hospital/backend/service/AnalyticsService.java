package com.hospital.backend.service;

import com.hospital.backend.dto.AnalyticsReportDto;

import java.util.List;

public interface AnalyticsService {
    List<AnalyticsReportDto> getAppointmentsPerDoctor();
    List<AnalyticsReportDto> getRevenuePerDepartment();
    List<AnalyticsReportDto> getDailyAppointmentCount();
    List<AnalyticsReportDto> getTopDoctorsByAppointments();
}
