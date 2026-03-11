package com.hospital.backend.service.impl;

import com.hospital.backend.dto.AppointmentDto;
import com.hospital.backend.dto.AppointmentMapper;
import com.hospital.backend.dto.AppointmentRequestDto;
import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.DoctorAvailableSlot;
import com.hospital.backend.entity.User;
import com.hospital.backend.enums.AppointmentStatus;
import com.hospital.backend.enums.Role;
import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.repository.DoctorAvailableSlotRepository;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final AppointmentMapper appointmentMapper;
    private final DoctorAvailableSlotRepository slotRepository;

    @Override
    @Transactional
    public AppointmentDto bookAppointment(Long patientId, AppointmentRequestDto requestDto) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (patient.getRole() != Role.PATIENT) {
            throw new RuntimeException("Only patients can book appointments");
        }

        User doctor = userRepository.findById(requestDto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("Selected user is not a doctor");
        }

        LocalDate date = requestDto.getAppointmentDate();
        LocalTime startTime = requestDto.getStartTime();
        LocalTime endTime = requestDto.getEndTime();

        // Check if slot exists
        List<DoctorAvailableSlot> slots = slotRepository.findByDoctorIdAndDateOrderByStartTimeAsc(doctor.getId(), date);
        boolean slotExists = slots.stream().anyMatch(slot -> 
            slot.isAvailable() && 
            (slot.getStartTime().equals(startTime) || slot.getStartTime().isBefore(startTime)) && 
            (slot.getEndTime().equals(endTime) || slot.getEndTime().isAfter(endTime))
        );

        if (!slotExists) {
            throw new RuntimeException("Doctor is not available at the requested time slot");
        }

        // Check overlapping appointments for doctor
        boolean overlapDoctor = appointmentRepository.existsOverlappingAppointment(doctor.getId(), date, startTime, endTime);
        if (overlapDoctor) {
            throw new RuntimeException("Doctor already has an overlapping appointment");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .department(doctor.getDepartment())
                .appointmentDate(date)
                .startTime(startTime)
                .endTime(endTime)
                .status(AppointmentStatus.BOOKED)
                .consultationFee(doctor.getDepartment() != null ? doctor.getDepartment().getConsultationFee() : java.math.BigDecimal.ZERO)
                .build();

        // Optionally mark slot as unavailable depending on business rules, usually slot is just a window,
        // and appointments occupy that window. Here we can let the overlapping query handle it.

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return appointmentMapper.toDto(savedAppointment);
    }

    @Override
    public AppointmentDto confirmAppointment(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("This appointment does not belong to you");
        }

        if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new RuntimeException("Only BOOKED appointments can be confirmed");
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        return appointmentMapper.toDto(appointmentRepository.save(appointment));
    }

    @Override
    public AppointmentDto completeAppointment(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("This appointment does not belong to you");
        }

        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new RuntimeException("Only CONFIRMED appointments can be completed");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        return appointmentMapper.toDto(appointmentRepository.save(appointment));
    }

    @Override
    public AppointmentDto cancelAppointment(Long appointmentId, Long userId, String userRole) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Completed appointments cannot be cancelled");
        }

        if (userRole.equals("ROLE_PATIENT")) {
            if (!appointment.getPatient().getId().equals(userId)) {
                throw new RuntimeException("You cannot cancel someone else's appointment");
            }
            if (appointment.getStatus() != AppointmentStatus.BOOKED) {
                throw new RuntimeException("Patients can only cancel BOOKED appointments before confirmation");
            }
        } 
        else if (userRole.equals("ROLE_DOCTOR") && !appointment.getDoctor().getId().equals(userId)) {
             throw new RuntimeException("You cannot cancel someone else's appointment");
        }
        else if (userRole.equals("ROLE_ADMIN")) {
            // Admin can cancel confirmed appointments
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        return appointmentMapper.toDto(appointmentRepository.save(appointment));
    }

    @Override
    public List<AppointmentDto> getAppointmentsByPatient(Long patientId) {
        return appointmentMapper.toDtoList(appointmentRepository.findByPatientIdOrderByAppointmentDateDescStartTimeDesc(patientId));
    }

    @Override
    public List<AppointmentDto> getAppointmentsByDoctor(Long doctorId) {
        return appointmentMapper.toDtoList(appointmentRepository.findByDoctorIdOrderByAppointmentDateDescStartTimeDesc(doctorId));
    }

    @Override
    public List<AppointmentDto> getAllAppointments() {
        return appointmentMapper.toDtoList(appointmentRepository.findAll());
    }
}
