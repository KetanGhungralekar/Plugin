package com.dailycodebuffer.Service;

import com.dailycodebuffer.Model.User;
import com.dailycodebuffer.Model.Video;
import com.dailycodebuffer.Repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    public Video saveVideo(Video video) {
        return videoRepository.save(video);
    }

    public Video getVideoById(Long id) {
        return videoRepository.findById(id).orElseThrow(() -> new RuntimeException("Video not found"));
    }

    public List<Video> getVideosByUser(User user) {
        return videoRepository.findByUploadedBy(user);
    }
}