package com.hospital.backend.service;

import com.hospital.backend.dto.UserDto;
import java.util.List;

public interface UserService {
    List<UserDto> getAllDoctors();
    List<UserDto> getDoctorsByDepartment(Long departmentId);
    List<UserDto> getAllUsers(); // For Admin
    UserDto getUserById(Long id);
}
