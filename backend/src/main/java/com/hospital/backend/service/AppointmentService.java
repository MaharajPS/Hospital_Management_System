package com.hospital.backend.service;

import com.hospital.backend.dto.AppointmentDto;
import com.hospital.backend.dto.AppointmentRequestDto;

import java.util.List;

public interface AppointmentService {

    AppointmentDto bookAppointment(Long patientId, AppointmentRequestDto requestDto);
    
    AppointmentDto confirmAppointment(Long appointmentId, Long doctorId);
    
    AppointmentDto completeAppointment(Long appointmentId, Long doctorId);
    
    // Admin or Patient
    AppointmentDto cancelAppointment(Long appointmentId, Long userId, String userRole);
    
    List<AppointmentDto> getAppointmentsByPatient(Long patientId);
    
    List<AppointmentDto> getAppointmentsByDoctor(Long doctorId);
    
    List<AppointmentDto> getAllAppointments();
}
