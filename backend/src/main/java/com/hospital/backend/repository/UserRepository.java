package com.hospital.backend.repository;

import com.hospital.backend.entity.User;
import com.hospital.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<String> findEmailById(Long id); // optimized check
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByRoleAndDepartmentId(Role role, Long departmentId);
}
