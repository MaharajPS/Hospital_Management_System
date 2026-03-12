package com.hospital.backend.service;

import com.hospital.backend.dto.UserDto;

import java.util.List;

public interface UserService {

    // PUBLIC / PATIENT APIs

    List<UserDto> getAllDoctors();

    List<UserDto> getDoctorsByDepartment(Long departmentId);

    UserDto getUserById(Long id);


    // ADMIN APIs

    List<UserDto> getAllUsers();

    UserDto createUser(UserDto userDto);

    UserDto updateUser(Long id, UserDto userDto);

    void deleteUser(Long id);
}