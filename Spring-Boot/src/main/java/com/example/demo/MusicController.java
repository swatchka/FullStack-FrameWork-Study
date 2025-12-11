package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/music")
@CrossOrigin(origins = "*")
public class MusicController {

    @Autowired
    private S3Service s3Service;

    @GetMapping("/play")
    public ResponseEntity<Map<String, String>> getMusicUrl(@RequestParam String filename) {
        if (filename == null || filename.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Generate the presigned URL
        String presignedUrl = s3Service.getPresignedUrlForDownload(filename);

        return ResponseEntity.ok(Collections.singletonMap("url", presignedUrl));
    }
}
