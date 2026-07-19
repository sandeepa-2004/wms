package com.wms.repository;

import com.wms.model.CollectionRequest;
import com.wms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionRequestRepository extends JpaRepository<CollectionRequest, Long> {
    List<CollectionRequest> findByResident(User resident);
    List<CollectionRequest> findByResidentId(Long residentId);
    List<CollectionRequest> findByStatus(String status);
}
