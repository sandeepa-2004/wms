package com.wms.controller;

import com.wms.dto.CollectionRequestDTO;
import com.wms.service.CollectionRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin
public class CollectionRequestController {

    @Autowired
    private CollectionRequestService requestService;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody CollectionRequestDTO requestDTO) {
        try {
            CollectionRequestDTO created = requestService.createRequest(requestDTO);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<CollectionRequestDTO>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/resident/{residentId}")
    public ResponseEntity<List<CollectionRequestDTO>> getRequestsByResident(@PathVariable Long residentId) {
        return ResponseEntity.ok(requestService.getRequestsByResident(residentId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            if (status == null) {
                return ResponseEntity.badRequest().body("status is required");
            }
            CollectionRequestDTO updated = requestService.updateRequestStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/schedule")
    public ResponseEntity<?> schedule(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String scheduledDateStr = payload.get("scheduledDate");
            if (scheduledDateStr == null) {
                return ResponseEntity.badRequest().body("scheduledDate is required");
            }
            LocalDateTime scheduledDate = LocalDateTime.parse(scheduledDateStr);
            CollectionRequestDTO updated = requestService.scheduleRequest(id, scheduledDate);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id) {
        try {
            CollectionRequestDTO updated = requestService.completeRequest(id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
