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

    // Public or Patient accessible
    @GetMapping("/doctors")
    public ResponseEntity<List<UserDto>> getAllDoctors(@RequestParam(required = false) Long departmentId) {
        if (departmentId != null) {
            return ResponseEntity.ok(userService.getDoctorsByDepartment(departmentId));
        }
        return ResponseEntity.ok(userService.getAllDoctors());
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<UserDto> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Admin accessible constraints
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
