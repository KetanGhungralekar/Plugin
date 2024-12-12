package com.dailycodebuffer.Controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dailycodebuffer.Model.USER_ROLE;
import com.dailycodebuffer.Model.User;
import com.dailycodebuffer.Model.Video;
import com.dailycodebuffer.Response.ListVideos;
import com.dailycodebuffer.Service.VideoService;
import com.dailycodebuffer.Response.VideoRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

import com.dailycodebuffer.Service.UserService;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.File;
import java.nio.file.StandardCopyOption;

import java.util.Base64;
import java.util.Map;

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
        String videoFilePath = "/videos/" + video.getFileName();
        videoRequest.setVideoFilePath(videoFilePath);
        return videoRequest;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadVideo(@RequestParam("title") String title,
                                              @RequestParam("description") String description,
                                              @RequestParam("role") USER_ROLE role,
                                              @RequestParam("uploadedBy") String uploadedBy,
                                              @RequestParam("videoFile") MultipartFile videoFile,
                                              @RequestHeader("Authorization") String jwt) {
        try {
            // Initialize Cloudinary
            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", "ds8zfoutr",
                    "api_key", "138219315573231",
                    "api_secret", "UWfkikc4r4mdFpUF_3z_himq8dk"
            ));

            // Upload the video to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(videoFile.getBytes(), ObjectUtils.asMap("resource_type", "video"));

            // Get the URL of the uploaded video from the Cloudinary response
            String videoUrl = (String) uploadResult.get("url");

            // Create and save your video object, with the URL stored in the database
            Video video = new Video();
            video.setTitle(title);
            video.setDescription(description);
            video.setFileName(videoFile.getOriginalFilename());  // You may want to store the file name or Cloudinary URL
            video.setFileType(videoFile.getContentType());
            video.setVideoUrl(videoUrl);  // Store the Cloudinary URL

            // Retrieve the user based on JWT (assuming userService handles JWT authentication)
            User user = userService.FindUserByJwt(jwt);
            video.setUploadedBy(user);

            // Save video data to your service
            videoService.saveVideo(video);

            // Return success response with Cloudinary URL
            return ResponseEntity.ok("Video uploaded successfully! Video URL: " + videoUrl);
        } catch (IOException e) {
            // Return error if something goes wrong with uploading the video
            return ResponseEntity.status(400).body("Error uploading video: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
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
                VideoRequest videoRequest = convertVideoToVideoRequest(video);

                String videoUrl = video.getVideoUrl();  
                videoRequest.setVideoFilePath(videoUrl);  // Now pointing to the Cloudinary URL

                // Add the VideoRequest to the list
                listVideos.getVideos().add(videoRequest);
            }

            // Return the response containing the list of videos with Cloudinary URLs
            return ResponseEntity.ok(listVideos);
        } catch (Exception e) {
            // Handle errors, including possible invalid JWT token or failure to retrieve videos
            return ResponseEntity.status(400).body("Error fetching videos: " + e.getMessage());
        }
    }
}
