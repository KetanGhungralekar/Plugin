package com.dailycodebuffer.Response;

import com.dailycodebuffer.Model.USER_ROLE;
import lombok.Data;

@Data
public class VideoRequest {
    private String title;
    private String description;
    private String videoData;
    private USER_ROLE role;
    private String uploadedBy;
}

