package com.dailycodebuffer.Request;

import lombok.Data;

@Data
public class Loginrequest {
    private String email;
    private String password;
    private String role;
}