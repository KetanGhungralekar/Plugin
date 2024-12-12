package com.dailycodebuffer.Service;

import com.dailycodebuffer.Model.User;

public interface UserService {
    public User FindUserByJwt(String jwt) throws Exception;
    public User FindUserByEmail(String email) throws Exception;
}