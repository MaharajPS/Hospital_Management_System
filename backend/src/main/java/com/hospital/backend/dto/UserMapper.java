package com.hospital.backend.dto;

import com.hospital.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {DepartmentMapper.class})
public interface UserMapper {

    UserDto toDto(User user);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "availableSlots", ignore = true)
    @Mapping(target = "department", ignore = true)
    User toEntity(UserRegistrationDto dto);

    List<UserDto> toDtoList(List<User> users);
}
