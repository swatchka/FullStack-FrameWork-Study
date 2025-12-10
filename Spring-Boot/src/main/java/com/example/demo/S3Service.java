package com.example.demo;

import io.awspring.cloud.s3.S3Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class S3Service {

    @Autowired
    private S3Template s3Template;

    @Autowired
    private S3Presigner s3Presigner;

    @Value("${application.bucket.name}")
    private String bucketName;

    @Value("${application.bucket.folder}")
    private String bucketFolder; // "images/"

    // Deprecated: Server-side upload
    public String uploadFile(MultipartFile file) {
        String fileName = bucketFolder + UUID.randomUUID() + "_" + file.getOriginalFilename();
        
        try {
            return s3Template.upload(bucketName, fileName, file.getInputStream())
                    .getURL().toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }

    // New: Generate Presigned URL for Client-side upload
    public Map<String, String> getPresignedUrl(String originalFilename, String contentType) {
        String fileName = bucketFolder + UUID.randomUUID() + "_" + originalFilename;

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10)) // Valid for 10 minutes
                .putObjectRequest(objectRequest)
                .build();

        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);

        Map<String, String> result = new HashMap<>();
        result.put("presignedUrl", presignedRequest.url().toString());
        result.put("key", fileName);
        // Assuming public read for viewing, or we can generate a GET URL later
        // Constructing the public URL manually or using s3Template utilities if needed
        // For now, let's return the key so the client can send it back to save in DB.
        result.put("fileUrl", "https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/" + fileName); 
        
        return result;
    }
}
