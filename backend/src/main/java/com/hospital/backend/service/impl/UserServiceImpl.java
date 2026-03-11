package com.hospital.backend.service.impl;

import com.hospital.backend.dto.UserDto;
import com.hospital.backend.dto.UserMapper;
import com.hospital.backend.entity.User;
import com.hospital.backend.enums.Role;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public List<UserDto> getAllDoctors() {
        List<User> doctors = userRepository.findByRole(Role.DOCTOR);
        return userMapper.toDtoList(doctors);
    }

    @Override
    public List<UserDto> getDoctorsByDepartment(Long departmentId) {
        List<User> doctors = userRepository.findByRoleAndDepartmentId(Role.DOCTOR, departmentId);
        return userMapper.toDtoList(doctors);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userMapper.toDtoList(userRepository.findAll());
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toDto(user);
    }
}
