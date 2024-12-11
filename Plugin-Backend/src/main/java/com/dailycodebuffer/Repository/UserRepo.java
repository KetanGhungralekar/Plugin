package com.dailycodebuffer.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dailycodebuffer.Model.User;

public interface UserRepo extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
}
