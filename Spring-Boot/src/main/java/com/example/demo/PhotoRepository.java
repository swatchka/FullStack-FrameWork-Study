package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findAllByOrderByUploadedAtDesc();
    
    // Search by title or content
    List<Photo> findByTitleContainingOrContentContainingOrderByUploadedAtDesc(String title, String content);
}
