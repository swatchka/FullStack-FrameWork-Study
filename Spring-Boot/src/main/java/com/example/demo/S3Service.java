package com.example.demo;

import io.awspring.cloud.s3.S3Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    @Autowired
    private S3Template s3Template;

    @Value("${application.bucket.name}")
    private String bucketName;

    @Value("${application.bucket.folder}")
    private String bucketFolder; // "images/"

    public String uploadFile(MultipartFile file) {
        String fileName = bucketFolder + UUID.randomUUID() + "_" + file.getOriginalFilename();
        
        try {
            return s3Template.upload(bucketName, fileName, file.getInputStream())
                    .getURL().toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }
}
