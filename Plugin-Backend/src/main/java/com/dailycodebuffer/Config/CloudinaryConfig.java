package com.dailycodebuffer.Config;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "ds8zfoutr",
                "api_key", "138219315573231",
                "api_secret", "UWfkikc4r4mdFpUF_3z_himq8dk"
        ));
    }
}

