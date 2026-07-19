package com.wms.service;

import com.wms.dto.BinDTO;

import java.util.List;

public interface BinService {
    BinDTO createBin(BinDTO binDTO);
    BinDTO updateBinLevel(Long id, Double currentLevel);
    BinDTO getBinById(Long id);
    List<BinDTO> getAllBins();
    void deleteBin(Long id);
}
