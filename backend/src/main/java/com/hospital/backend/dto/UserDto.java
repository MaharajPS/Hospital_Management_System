package com.hospital.backend.dto;

import com.hospital.backend.enums.Role;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String specialization;
    private DepartmentDto department;
}
