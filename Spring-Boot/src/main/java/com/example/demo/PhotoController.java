package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(origins = "*")
public class PhotoController {

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private PhotoLikeRepository photoLikeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private FileStorageService fileStorageService; // Keeping it for backward compatibility / fallback if needed (optional)

    @GetMapping
    public List<Photo> getAllPhotos(@RequestParam(value = "query", required = false) String query) {
        if (query != null && !query.isEmpty()) {
            return photoRepository.findByTitleContainingOrContentContainingOrderByUploadedAtDesc(query, query);
        }
        return photoRepository.findAllByOrderByUploadedAtDesc();
    }

    @PostMapping
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file,
                                         @RequestParam("title") String title,
                                         @RequestParam("userId") Long userId,
                                         @RequestParam(value = "content", required = false) String content) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Upload to S3
        String fileUrl = s3Service.uploadFile(file);
        
        // Save full URL to DB as fileName
        Photo photo = new Photo(title, fileUrl, userOptional.get(), content);
        photoRepository.save(photo);
        photoRepository.save(photo);

        return ResponseEntity.ok("Photo uploaded successfully!");
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePhoto(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Photo> photoOpt = photoRepository.findById(id);

        if (userOpt.isEmpty() || photoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User or Photo not found");
        }

        User user = userOpt.get();
        Photo photo = photoOpt.get();

        // Check if already liked
        if (photoLikeRepository.findByUserAndPhoto(user, photo).isPresent()) {
            return ResponseEntity.badRequest().body("Already liked this photo!");
        }

        try {
            // Optimistic concurrency control happens here when saving photo
            photo.setLikeCount(photo.getLikeCount() + 1);
            photoRepository.save(photo); // This might throw ObjectOptimisticLockingFailureException

            PhotoLike like = new PhotoLike(user, photo);
            photoLikeRepository.save(like);

            return ResponseEntity.ok(photo);
        } catch (ObjectOptimisticLockingFailureException e) {
            return ResponseEntity.status(409).body("Concurrency conflict! Please try again.");
        }
    }
}
