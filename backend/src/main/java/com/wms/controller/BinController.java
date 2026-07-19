package com.wms.controller;

import com.wms.dto.BinDTO;
import com.wms.service.BinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bins")
@CrossOrigin
public class BinController {

    @Autowired
    private BinService binService;

    @PostMapping
    public ResponseEntity<?> createBin(@RequestBody BinDTO binDTO) {
        try {
            BinDTO createdBin = binService.createBin(binDTO);
            return ResponseEntity.ok(createdBin);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<BinDTO>> getAllBins() {
        return ResponseEntity.ok(binService.getAllBins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBinById(@PathVariable Long id) {
        try {
            BinDTO bin = binService.getBinById(id);
            return ResponseEntity.ok(bin);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/level")
    public ResponseEntity<?> updateBinLevel(@PathVariable Long id, @RequestBody Map<String, Double> payload) {
        try {
            Double currentLevel = payload.get("currentLevel");
            if (currentLevel == null) {
                return ResponseEntity.badRequest().body("currentLevel is required");
            }
            BinDTO updatedBin = binService.updateBinLevel(id, currentLevel);
            return ResponseEntity.ok(updatedBin);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBin(@PathVariable Long id) {
        try {
            binService.deleteBin(id);
            return ResponseEntity.ok("Bin deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
