package com.dailycodebuffer.Controller;

import com.dailycodebuffer.Model.User;
import com.dailycodebuffer.Model.Video;
import com.dailycodebuffer.Response.ListVideos;
import com.dailycodebuffer.Service.VideoService;
import com.dailycodebuffer.Response.VideoRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.dailycodebuffer.Service.UserService;

import java.util.Base64;

@RestController
@RequestMapping("/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @Autowired
    private UserService userService;

    private VideoRequest convertVideoToVideoRequest(Video video) {
        VideoRequest videoRequest = new VideoRequest();
        videoRequest.setTitle(video.getTitle());
        videoRequest.setDescription(video.getDescription());
        videoRequest.setVideoData(Base64.getEncoder().encodeToString(video.getVideoData()));
        return videoRequest;
    }

    @PostMapping
    public ResponseEntity<String> uploadVideo(@RequestBody VideoRequest videoRequest, @RequestHeader("Authorization") String jwt) {
        try {
            byte[] decodedVideoData = Base64.getDecoder().decode(videoRequest.getVideoData());

            Video video = new Video();
            video.setTitle(videoRequest.getTitle());
            video.setDescription(videoRequest.getDescription());
            video.setVideoData(decodedVideoData);

            User user = userService.FindUserByJwt(jwt);

            video.setUploadedBy(user);

            videoService.saveVideo(video);

            return ResponseEntity.ok("Video uploaded successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error uploading video: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideo(@PathVariable Long id) {
        Video video = videoService.getVideoById(id);
        return ResponseEntity.ok(video);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getVideosByUser(@RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.FindUserByJwt(jwt);
            List<Video> videos = videoService.getVideosByUser(user);

            ListVideos listVideos = new ListVideos();
            listVideos.setUploadedBy(user);

            for (Video video : videos) {
                listVideos.getVideos().add(convertVideoToVideoRequest(video));
            }
            return ResponseEntity.ok(listVideos);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error fetching videos: " + e.getMessage());
        }
    }
}
