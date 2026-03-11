package com.hospital.backend.controller;

import com.hospital.backend.dto.AppointmentDto;
import com.hospital.backend.dto.AppointmentRequestDto;
import com.hospital.backend.security.CustomUserDetails;
import com.hospital.backend.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // --- PATIENT APIs ---
    
    @PostMapping("/appointments/book")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentDto> bookAppointment(
            @Valid @RequestBody AppointmentRequestDto requestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return new ResponseEntity<>(appointmentService.bookAppointment(userDetails.getId(), requestDto), HttpStatus.CREATED);
    }

    @GetMapping("/appointments/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<AppointmentDto>> getMyPatientAppointments(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(userDetails.getId()));
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<AppointmentDto> cancelAppointment(
            @PathVariable Long id, 
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("");
                
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, userDetails.getId(), role));
    }

    // --- DOCTOR APIs ---

    @GetMapping("/doctor/appointments")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentDto>> getDoctorAppointments(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(userDetails.getId()));
    }

    @PutMapping("/appointments/{id}/confirm")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentDto> confirmAppointment(
            @PathVariable Long id, 
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id, userDetails.getId()));
    }

    @PutMapping("/appointments/{id}/complete")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentDto> completeAppointment(
            @PathVariable Long id, 
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.completeAppointment(id, userDetails.getId()));
    }

    // --- ADMIN APIs ---

    @GetMapping("/admin/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentDto>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }
}
