package com.hospital.backend.dto;

import com.hospital.backend.entity.Appointment;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class, DepartmentMapper.class})
public interface AppointmentMapper {

    AppointmentDto toDto(Appointment appointment);

    List<AppointmentDto> toDtoList(List<Appointment> appointments);
}
