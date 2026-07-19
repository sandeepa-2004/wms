package com.wms.service;

import com.wms.dto.BinDTO;
import com.wms.model.Bin;
import com.wms.repository.BinRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BinServiceImpl implements BinService {

    @Autowired
    private BinRepository binRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public BinDTO createBin(BinDTO binDTO) {
        Bin bin = modelMapper.map(binDTO, Bin.class);
        // Calculate status
        bin.setStatus(calculateStatus(bin.getCurrentLevel(), bin.getCapacity()));
        Bin savedBin = binRepository.save(bin);
        return modelMapper.map(savedBin, BinDTO.class);
    }

    @Override
    public BinDTO updateBinLevel(Long id, Double currentLevel) {
        Bin bin = binRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bin not found"));
        
        if (currentLevel > bin.getCapacity()) {
            throw new RuntimeException("Current level cannot exceed capacity");
        }
        
        bin.setCurrentLevel(currentLevel);
        bin.setStatus(calculateStatus(currentLevel, bin.getCapacity()));
        Bin updatedBin = binRepository.save(bin);
        return modelMapper.map(updatedBin, BinDTO.class);
    }

    @Override
    public BinDTO getBinById(Long id) {
        Bin bin = binRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bin not found"));
        return modelMapper.map(bin, BinDTO.class);
    }

    @Override
    public List<BinDTO> getAllBins() {
        return binRepository.findAll().stream()
                .map(bin -> modelMapper.map(bin, BinDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteBin(Long id) {
        if (!binRepository.existsById(id)) {
            throw new RuntimeException("Bin not found");
        }
        binRepository.deleteById(id);
    }

    private String calculateStatus(Double currentLevel, Double capacity) {
        if (capacity == null || capacity <= 0) return "EMPTY";
        double percentage = (currentLevel / capacity) * 100;
        if (percentage <= 20) {
            return "EMPTY";
        } else if (percentage <= 80) {
            return "MEDIUM";
        } else {
            return "FULL";
        }
    }
}
