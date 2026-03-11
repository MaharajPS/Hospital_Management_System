package com.hospital.backend.service.impl;

import com.hospital.backend.dto.AnalyticsReportDto;
import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AppointmentRepository appointmentRepository;

    @Override
    public List<AnalyticsReportDto> getAppointmentsPerDoctor() {
        return appointmentRepository.countAppointmentsPerDoctor();
    }

    @Override
    public List<AnalyticsReportDto> getRevenuePerDepartment() {
        return appointmentRepository.countRevenuePerDepartment();
    }

    @Override
    public List<AnalyticsReportDto> getDailyAppointmentCount() {
        return appointmentRepository.countDailyAppointments();
    }

    @Override
    public List<AnalyticsReportDto> getTopDoctorsByAppointments() {
        return appointmentRepository.findTopDoctors(); // Returns sorted by count
    }
}
