package com.hospital.backend.dto;

import com.hospital.backend.entity.DoctorAvailableSlot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DoctorAvailableSlotMapper {

    @Mapping(source = "doctor.id", target = "doctorId")
    DoctorAvailableSlotDto toDto(DoctorAvailableSlot slot);

    @Mapping(target = "doctor", ignore = true)
    DoctorAvailableSlot toEntity(DoctorAvailableSlotDto dto);

    List<DoctorAvailableSlotDto> toDtoList(List<DoctorAvailableSlot> slots);
}
