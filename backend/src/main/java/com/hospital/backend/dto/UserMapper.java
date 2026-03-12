package com.hospital.backend.dto;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.hospital.backend.entity.Department;
import com.hospital.backend.entity.User;

@Component
public class UserMapper {

    public UserDto toDto(User user) {

        if (user == null) return null;

        UserDto dto = new UserDto();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setSpecialization(user.getSpecialization());

        if (user.getDepartment() != null) {
            DepartmentDto dept = new DepartmentDto();
            dept.setId(user.getDepartment().getId());
            dept.setName(user.getDepartment().getName());
            dto.setDepartment(dept);
        }

        return dto;
    }

    public List<UserDto> toDtoList(List<User> users) {
        return users.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Used by Admin create user
    public User toEntity(UserDto dto, Department department) {

        return User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .role(dto.getRole())
                .specialization(dto.getSpecialization())
                .department(department)
                .build();
    }

    // ⭐ FIX: Used during registration
    public User toEntity(UserRegistrationDto dto) {

        return User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(dto.getRole())
                .specialization(dto.getSpecialization())
                .build();
    }
}