package com.wms.service;

import com.wms.dto.CollectionRequestDTO;
import com.wms.model.CollectionRequest;
import com.wms.model.User;
import com.wms.repository.CollectionRequestRepository;
import com.wms.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CollectionRequestServiceImpl implements CollectionRequestService {

    @Autowired
    private CollectionRequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CollectionRequestDTO createRequest(CollectionRequestDTO requestDTO) {
        User resident = userRepository.findById(requestDTO.getResidentId())
                .orElseThrow(() -> new RuntimeException("Resident user not found"));

        CollectionRequest request = CollectionRequest.builder()
                .resident(resident)
                .wasteType(requestDTO.getWasteType())
                .description(requestDTO.getDescription())
                .quantity(requestDTO.getQuantity())
                .status("PENDING")
                .requestDate(LocalDateTime.now())
                .build();

        CollectionRequest savedRequest = requestRepository.save(request);
        return mapToDTO(savedRequest);
    }

    @Override
    public CollectionRequestDTO updateRequestStatus(Long id, String status) {
        CollectionRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        if ("COMPLETED".equals(status)) {
            request.setCompletedDate(LocalDateTime.now());
        }
        CollectionRequest updatedRequest = requestRepository.save(request);
        return mapToDTO(updatedRequest);
    }

    @Override
    public CollectionRequestDTO scheduleRequest(Long id, LocalDateTime scheduledDate) {
        CollectionRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("SCHEDULED");
        request.setScheduledDate(scheduledDate);
        CollectionRequest updatedRequest = requestRepository.save(request);
        return mapToDTO(updatedRequest);
    }

    @Override
    public CollectionRequestDTO completeRequest(Long id) {
        CollectionRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("COMPLETED");
        request.setCompletedDate(LocalDateTime.now());
        CollectionRequest updatedRequest = requestRepository.save(request);
        return mapToDTO(updatedRequest);
    }

    @Override
    public CollectionRequestDTO getRequestById(Long id) {
        CollectionRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        return mapToDTO(request);
    }

    @Override
    public List<CollectionRequestDTO> getRequestsByResident(Long residentId) {
        return requestRepository.findByResidentId(residentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CollectionRequestDTO> getAllRequests() {
        return requestRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private CollectionRequestDTO mapToDTO(CollectionRequest request) {
        CollectionRequestDTO dto = modelMapper.map(request, CollectionRequestDTO.class);
        dto.setResidentId(request.getResident().getId());
        dto.setResidentUsername(request.getResident().getUsername());
        return dto;
    }
}
