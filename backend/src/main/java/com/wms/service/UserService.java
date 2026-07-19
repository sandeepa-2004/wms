package com.wms.service;

import com.wms.dto.LoginRequestDTO;
import com.wms.dto.LoginResponseDTO;
import com.wms.dto.RegisterRequestDTO;
import com.wms.dto.UserDTO;

import java.util.List;

public interface UserService {
    UserDTO registerUser(RegisterRequestDTO registerRequest);
    LoginResponseDTO loginUser(LoginRequestDTO loginRequest);
    UserDTO getUserById(Long id);
    List<UserDTO> getAllUsers();
}
