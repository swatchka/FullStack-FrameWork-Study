package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "photo_id"}))
public class PhotoLike {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

    public PhotoLike() {}

    public PhotoLike(User user, Photo photo) {
        this.user = user;
        this.photo = photo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Photo getPhoto() { return photo; }
    public void setPhoto(Photo photo) { this.photo = photo; }
}
