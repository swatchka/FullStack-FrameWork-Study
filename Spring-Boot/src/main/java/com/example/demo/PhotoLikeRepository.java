package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PhotoLikeRepository extends JpaRepository<PhotoLike, Long> {
    Optional<PhotoLike> findByUserAndPhoto(User user, Photo photo);
}


