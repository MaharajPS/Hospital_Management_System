package com.hospital.backend.repository;

import com.hospital.backend.entity.DoctorAvailableSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DoctorAvailableSlotRepository extends JpaRepository<DoctorAvailableSlot, Long> {
    List<DoctorAvailableSlot> findByDoctorIdAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(Long doctorId, LocalDate date);
    List<DoctorAvailableSlot> findByDoctorIdAndDateOrderByStartTimeAsc(Long doctorId, LocalDate date);
    boolean existsByDoctorIdAndDateAndStartTime(Long doctorId, LocalDate date, java.time.LocalTime startTime);
}
