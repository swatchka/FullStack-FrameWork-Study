package com.example.demo;

import javax.persistence.*;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
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

    public Photo(String title, String fileName, User author, String content) {
        this.title = title;
        this.fileName = fileName;
        this.author = author;
        this.content = content;
        this.uploadedAt = LocalDateTime.now();
    }
}
