# Communication Assessment Platform

## Description
The Communication Assessment Platform integrates video functionality, speech analysis, and assessment features. It offers real-time video recording, storage, and playback. The system provides real-time speech transcription with over 70% accuracy and includes a scoring mechanism and personalized feedback. It also features body language analysis, multilingual support, and a tailored improvement plan.

## Core Features
- **Video Functionality**: Includes recording, storage, and playback of videos.
- **Speech Analysis**: Real-time transcription with >70% accuracy.
- **Assessment Features**: Provides scoring and detailed feedback mechanisms.
- **Cloud Storage**: Videos are stored in the cloud to handle any size of video.
- **Authentication**: Secure authentication using JWT.

## Project Structure
```
.vscode/
    settings.json
Plugin/
    .vscode/
        settings.json
    Backend/
        .idea/
        Final_Analyser.py
        Grammer_correcter.py
        New_Grammar_Corrector.py
        speechAnalysis.py
        Transcriber.py
    package.json
    plugin_frontend/
        .gitignore
        eslint.config.js
        generated_pdf/
        generated_pdfs/
        index.html
        package.json
        postcss.config.js
        src/
        tailwind.config.js
        temp_audio/
        tsconfig.app.json
        tsconfig.json
        tsconfig.node.json
    Plugin-Backend/
        ...
    README.md
    temp_audio/
temp_audio/
```

## Installation

### Frontend
1. Navigate to the `plugin_frontend` directory:
    ```bash
    cd Plugin/plugin_frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Build the project:
    ```bash
    npm run build
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```
5. Open the application at [http://localhost:5173](http://localhost:5173).

### Backend
1. Navigate to the `Backend` directory:
    ```bash
    cd Plugin/Backend
    ```
2. Install dependencies and run the server:
    ```bash
    # Assuming you have Python and pip installed
    pip install -r requirements.txt
    python Final_Analyser.py
    ```

## Usage
1. Open the frontend application in your browser.
2. Use the video recording feature to record a video.
3. The system will transcribe the speech in real-time and provide detailed analysis and feedback.

## Cloud Storage
Videos are stored in the cloud using Cloudinary. This allows the platform to handle videos of any size efficiently. The backend is configured to upload videos to Cloudinary and store the URLs in the database.

### Cloudinary Configuration
The Cloudinary configuration is set up in the backend in the file [Plugin/Plugin-Backend/src/main/java/com/dailycodebuffer/Config/CloudinaryConfig.java](Plugin/Plugin-Backend/src/main/java/com/dailycodebuffer/Config/CloudinaryConfig.java).

```java
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
```

## Authentication
Authentication is handled using JWT (JSON Web Tokens). The backend generates a JWT upon successful login, which is then used to authenticate subsequent requests.

### JWT Configuration
The JWT configuration is set up in the backend in the file [Plugin/Plugin-Backend/src/main/java/com/dailycodebuffer/Config/JwtProvider.java](Plugin/Plugin-Backend/src/main/java/com/dailycodebuffer/Config/JwtProvider.java).

```java
package com.dailycodebuffer.Config;

import java.util.Collection;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProvider {
    private SecretKey secretKey = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    public String generateToken(Authentication auth) {
        Collection<? extends GrantedAuthority> grantedAuthorities = auth.getAuthorities();
        String roles = populateAuthorities(grantedAuthorities);
        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 86400000))
                .claim("authorities", roles)
                .claim("email", auth.getName())
                .signWith(secretKey)
                .compact();
    }

    public String GetEmailfromJwt(String jwt) {
        jwt = jwt.substring(7);
        Claims claims = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(jwt).getBody();
        return String.valueOf(claims.get("email"));
    }

    private String populateAuthorities(Collection<? extends GrantedAuthority> grantedAuthorities) {
        // Implementation here
    }
}
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
