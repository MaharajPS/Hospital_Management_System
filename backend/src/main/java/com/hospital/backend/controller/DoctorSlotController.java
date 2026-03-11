package com.hospital.backend.controller;

import com.hospital.backend.dto.DoctorAvailableSlotDto;
import com.hospital.backend.service.DoctorAvailableSlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorSlotController {

    private final DoctorAvailableSlotService slotService;

    @PostMapping("/slots")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorAvailableSlotDto> addSlot(@Valid @RequestBody DoctorAvailableSlotDto slotDto) {
        return new ResponseEntity<>(slotService.addSlot(slotDto), HttpStatus.CREATED);
    }

    @GetMapping("/{doctorId}/slots")
    public ResponseEntity<List<DoctorAvailableSlotDto>> getDoctorSlots(
            @PathVariable Long doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(slotService.getSlotsForDoctor(doctorId, date));
    }

    @PutMapping("/slots/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorAvailableSlotDto> updateSlot(@PathVariable Long id, @Valid @RequestBody DoctorAvailableSlotDto slotDto) {
        return ResponseEntity.ok(slotService.updateSlot(id, slotDto));
    }

    @DeleteMapping("/slots/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        slotService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }
}
