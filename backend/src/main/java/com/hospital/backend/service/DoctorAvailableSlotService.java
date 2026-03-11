package com.hospital.backend.service;

import com.hospital.backend.dto.DoctorAvailableSlotDto;

import java.time.LocalDate;
import java.util.List;

public interface DoctorAvailableSlotService {
    DoctorAvailableSlotDto addSlot(DoctorAvailableSlotDto slotDto);
    List<DoctorAvailableSlotDto> getSlotsForDoctor(Long doctorId, LocalDate date); // optionally scoped by date
    DoctorAvailableSlotDto updateSlot(Long id, DoctorAvailableSlotDto slotDto);
    void deleteSlot(Long id);
}
