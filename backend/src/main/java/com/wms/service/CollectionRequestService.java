package com.wms.service;

import com.wms.dto.CollectionRequestDTO;

import java.util.List;

public interface CollectionRequestService {
    CollectionRequestDTO createRequest(CollectionRequestDTO requestDTO);
    CollectionRequestDTO updateRequestStatus(Long id, String status);
    CollectionRequestDTO scheduleRequest(Long id, java.time.LocalDateTime scheduledDate);
    CollectionRequestDTO completeRequest(Long id);
    CollectionRequestDTO getRequestById(Long id);
    List<CollectionRequestDTO> getRequestsByResident(Long residentId);
    List<CollectionRequestDTO> getAllRequests();
}
