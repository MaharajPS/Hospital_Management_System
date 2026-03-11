package com.hospital.backend.service.impl;

import com.hospital.backend.dto.DoctorAvailableSlotDto;
import com.hospital.backend.dto.DoctorAvailableSlotMapper;
import com.hospital.backend.entity.DoctorAvailableSlot;
import com.hospital.backend.entity.User;
import com.hospital.backend.repository.DoctorAvailableSlotRepository;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.service.DoctorAvailableSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorAvailableSlotServiceImpl implements DoctorAvailableSlotService {

    private final DoctorAvailableSlotRepository slotRepository;
    private final UserRepository userRepository;
    private final DoctorAvailableSlotMapper slotMapper;

    @Override
    public DoctorAvailableSlotDto addSlot(DoctorAvailableSlotDto slotDto) {
        User doctor = userRepository.findById(slotDto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (slotRepository.existsByDoctorIdAndDateAndStartTime(doctor.getId(), slotDto.getDate(), slotDto.getStartTime())) {
            throw new RuntimeException("Slot already exists for the given date and start time");
        }

        DoctorAvailableSlot slot = slotMapper.toEntity(slotDto);
        slot.setDoctor(doctor);
        slot.setAvailable(true); // new slots are available by default

        DoctorAvailableSlot savedSlot = slotRepository.save(slot);
        return slotMapper.toDto(savedSlot);
    }

    @Override
    public List<DoctorAvailableSlotDto> getSlotsForDoctor(Long doctorId, LocalDate date) {
        List<DoctorAvailableSlot> slots;
        if (date != null) {
            slots = slotRepository.findByDoctorIdAndDateOrderByStartTimeAsc(doctorId, date);
        } else {
            // Get from today onwards if date is not specified
            slots = slotRepository.findByDoctorIdAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(doctorId, LocalDate.now());
        }
        return slotMapper.toDtoList(slots);
    }

    @Override
    public DoctorAvailableSlotDto updateSlot(Long id, DoctorAvailableSlotDto slotDto) {
        DoctorAvailableSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
                
        // Only update times, don't allow changing doctor.
        slot.setDate(slotDto.getDate());
        slot.setStartTime(slotDto.getStartTime());
        slot.setEndTime(slotDto.getEndTime());
        slot.setAvailable(slotDto.isAvailable());

        DoctorAvailableSlot updatedSlot = slotRepository.save(slot);
        return slotMapper.toDto(updatedSlot);
    }

    @Override
    public void deleteSlot(Long id) {
        DoctorAvailableSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        // Check if slot is booked - business rule might prevent deletion if an appointment exists.
        // Handled in Appointment constraints.
        slotRepository.delete(slot);
    }
}
