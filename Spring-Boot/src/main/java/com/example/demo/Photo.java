package com.example.demo;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Photo {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    private String fileName;

    private String content; // Text description

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User author;

    private int likeCount = 0;

    @Version
    private Long version; // Optimistic Locking

    private LocalDateTime uploadedAt;

    public Photo() {}

    public Photo(String title, String fileName, User author, String content) {
        this.title = title;
        this.fileName = fileName;
        this.author = author;
        this.content = content;
        this.uploadedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
