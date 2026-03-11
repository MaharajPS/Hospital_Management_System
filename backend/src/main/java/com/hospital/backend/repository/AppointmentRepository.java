package com.hospital.backend.repository;

import com.hospital.backend.entity.Appointment;
import com.hospital.backend.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDescStartTimeDesc(Long patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDescStartTimeDesc(Long doctorId);
    List<Appointment> findByDoctorIdAndAppointmentDateOrderByStartTimeAsc(Long doctorId, LocalDate date);
    
    // Check overlaps
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date " +
           "AND a.status != 'CANCELLED' " +
           "AND ((a.startTime <= :startTime AND a.endTime > :startTime) " +
           "OR (a.startTime < :endTime AND a.endTime >= :endTime) " +
           "OR (a.startTime >= :startTime AND a.endTime <= :endTime))")
    boolean existsOverlappingAppointment(@Param("doctorId") Long doctorId, 
                                         @Param("date") LocalDate date, 
                                         @Param("startTime") java.time.LocalTime startTime, 
                                         @Param("endTime") java.time.LocalTime endTime);

    // Analytics Queries
    @Query("SELECT new com.hospital.backend.dto.AnalyticsReportDto(a.doctor.name, COUNT(a), COALESCE(SUM(a.consultationFee), 0)) " +
           "FROM Appointment a GROUP BY a.doctor.name")
    List<com.hospital.backend.dto.AnalyticsReportDto> countAppointmentsPerDoctor();

    @Query("SELECT new com.hospital.backend.dto.AnalyticsReportDto(a.department.name, COUNT(a), COALESCE(SUM(a.consultationFee), 0)) " +
           "FROM Appointment a GROUP BY a.department.name")
    List<com.hospital.backend.dto.AnalyticsReportDto> countRevenuePerDepartment();

    @Query("SELECT new com.hospital.backend.dto.AnalyticsReportDto(CAST(a.appointmentDate AS string), COUNT(a), COALESCE(SUM(a.consultationFee), 0)) " +
           "FROM Appointment a GROUP BY a.appointmentDate ORDER BY a.appointmentDate DESC")
    List<com.hospital.backend.dto.AnalyticsReportDto> countDailyAppointments();

    @Query("SELECT new com.hospital.backend.dto.AnalyticsReportDto(a.doctor.name, COUNT(a), COALESCE(SUM(a.consultationFee), 0)) " +
           "FROM Appointment a GROUP BY a.doctor.name ORDER BY COUNT(a) DESC")
    List<com.hospital.backend.dto.AnalyticsReportDto> findTopDoctors();
}
