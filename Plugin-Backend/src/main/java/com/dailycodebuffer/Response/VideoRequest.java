package com.dailycodebuffer.Response;

import com.dailycodebuffer.Model.USER_ROLE;
import org.springframework.web.multipart.MultipartFile;
import lombok.Data;

@Data
public class VideoRequest {
    private String title;
    private String description;
    private MultipartFile videoFile; // For handling video file uploads
    private USER_ROLE role;
    private String uploadedBy;
    public String videoFilePath;
}
