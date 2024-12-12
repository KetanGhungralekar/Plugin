package com.dailycodebuffer.Repository;

import com.dailycodebuffer.Model.User;
import com.dailycodebuffer.Model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByUploadedBy(User uploadedBy);
}