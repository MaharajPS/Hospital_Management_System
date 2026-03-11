package com.hospital.backend.dto;

import com.hospital.backend.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    DepartmentDto toDto(Department department);

    @Mapping(target = "id", ignore = true)
    Department toEntity(DepartmentDto dto);

    List<DepartmentDto> toDtoList(List<Department> departments);
}
