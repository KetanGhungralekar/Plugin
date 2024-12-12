package com.dailycodebuffer.Response;

import com.dailycodebuffer.Model.USER_ROLE;
import com.dailycodebuffer.Model.User;
import com.dailycodebuffer.Model.Video;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ListVideos {
    private List<VideoRequest> videos = new ArrayList<>();;
    private User uploadedBy;
}