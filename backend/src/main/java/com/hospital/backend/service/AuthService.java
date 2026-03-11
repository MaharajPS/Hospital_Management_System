package com.hospital.backend.service;

import com.hospital.backend.dto.AuthResponseDto;
import com.hospital.backend.dto.LoginDto;
import com.hospital.backend.dto.UserRegistrationDto;

public interface AuthService {
    AuthResponseDto register(UserRegistrationDto registerDto);
    AuthResponseDto login(LoginDto loginDto);
}
