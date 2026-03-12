package com.hospital.backend.service.impl;

import com.hospital.backend.dto.UserDto;
import com.hospital.backend.dto.UserMapper;
import com.hospital.backend.entity.Department;
import com.hospital.backend.entity.User;
import com.hospital.backend.enums.Role;
import com.hospital.backend.repository.DepartmentRepository;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserDto> getAllDoctors() {

        List<User> doctors = userRepository.findByRole(Role.DOCTOR);

        return userMapper.toDtoList(doctors);
    }

    @Override
    public List<UserDto> getDoctorsByDepartment(Long departmentId) {

        List<User> doctors =
                userRepository.findByRoleAndDepartmentId(Role.DOCTOR, departmentId);

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

    // ADMIN CREATE USER

    @Override
    public UserDto createUser(UserDto userDto) {

        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Department department = null;

        if (userDto.getDepartmentId() != null) {
            department = departmentRepository.findById(userDto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
        }

        User user = userMapper.toEntity(userDto, department);

        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        User savedUser = userRepository.save(user);

        return userMapper.toDto(savedUser);
    }

    // ADMIN UPDATE USER

    @Override
    public UserDto updateUser(Long id, UserDto userDto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setRole(userDto.getRole());
        user.setSpecialization(userDto.getSpecialization());

        if (userDto.getDepartmentId() != null) {

            Department department = departmentRepository
                    .findById(userDto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));

            user.setDepartment(department);
        }

        userRepository.save(user);

        return userMapper.toDto(user);
    }

    // ADMIN DELETE USER

    @Override
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);
    }
}