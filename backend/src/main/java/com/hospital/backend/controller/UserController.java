package com.hospital.backend.controller;

import com.hospital.backend.dto.UserDto;
import com.hospital.backend.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // PUBLIC

    @GetMapping("/doctors")
    public ResponseEntity<List<UserDto>> getAllDoctors(
            @RequestParam(required = false) Long departmentId) {

        if (departmentId != null) {
            return ResponseEntity.ok(
                    userService.getDoctorsByDepartment(departmentId));
        }

        return ResponseEntity.ok(userService.getAllDoctors());
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<UserDto> getDoctor(@PathVariable Long id) {

        return ResponseEntity.ok(userService.getUserById(id));
    }

    // ADMIN

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getUsers() {

        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto dto) {

        return ResponseEntity.ok(userService.createUser(dto));
    }

    @PutMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @RequestBody UserDto dto) {

        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    @DeleteMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok().build();
    }
}