package com.dailycodebuffer.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dailycodebuffer.Config.JwtProvider;
import com.dailycodebuffer.Model.User;
import com.dailycodebuffer.Repository.UserRepo;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UserRepo userRepository;

    @Override
    public User FindUserByJwt(String jwt) throws Exception {
        try{
            String email = jwtProvider.GetEmailfromJwt(jwt);
            User user = userRepository.findByEmail(email);
            if (user == null){
                throw new Exception("User not found");
            }
            return user;
        }
        catch (Exception e){
            throw new Exception("Invalid token");
        }
    }

    @Override
    public User FindUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null){
            throw new Exception("User not found");
        }
        return user;
    }
}