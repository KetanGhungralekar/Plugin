package com.dailycodebuffer.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;
    private String description;

    private String fileName;
    private String fileType;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User uploadedBy;
    public String videoUrl;
}
