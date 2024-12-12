import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// Define types for user, video data, and context
interface User {
  email: string;
  username: string;
  role: string;
  token: string;
}

interface VideoRequest {
  title: string;
  description: string;
  videoData: string; // Base64 encoded video data
}

interface VideoResponse extends VideoRequest {
  uploadedBy: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  signup: (email: string, username: string, password: string, role: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  uploadVideo: (videoRequest: VideoRequest) => Promise<void>;
  getVideosByUser: () => Promise<VideoResponse[]>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>('eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3MzM5NDY2OTEsImV4cCI6MTczNDAzMzA5MSwiYXV0aG9yaXRpZXMiOiJST0xFX1VTRVIiLCJlbWFpbCI6InBjYXdkaHJ5MTJAZ21haWwuY29tIn0._FxC8XdF-IKOjQ-oHj3dTMdPyztnUiU2C5Z-gZf2Kv8PeXWBnm-KU-mM5FivFz2y');

  // Signup function
  const signup = async (email: string, username: string, password: string, role: string) => {
    try {
      const response = await axios.post("http://localhost:8080/auth/signup", {
        email,
        username,
        password,
        role,
      });
      const data = response.data;
      const { token, role: userRole } = data;

      setUser({
        email,
        username,
        role: userRole,
        token,
      });
      setToken(token);
      console.log("Signup successful:", data);
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      throw error;
    }
  };

  // Signin function
  const signin = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:8080/auth/signin", {
        email,
        password,
      });
      const data = response.data;
      const { token, role } = data;

      setUser({
        email,
        username: "", // Username is not returned on login
        role,
        token,
      });
      setToken(token);
      console.log("Login successful:", data);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // Upload video function
  const uploadVideo = async (videoRequest: VideoRequest) => {
    try {
      if (!token) throw new Error("User is not authenticated.");
      await axios.post("http://localhost:8080/videos", videoRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Video uploaded successfully!");
    } catch (error) {
      console.error("Upload video error:", error.response?.data || error.message);
      throw error;
    }
  };

  // Get videos by user function
  const getVideosByUser = async (): Promise<VideoResponse[]> => {
    try {
      if (!token) throw new Error("User is not authenticated.");
      const response = await axios.get("http://localhost:8080/videos/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: VideoResponse[] = response.data.videos;
      console.log("Fetched videos by user:", data);
      return data;
    } catch (error) {
      console.error("Error fetching videos:", error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, signin, logout, uploadVideo, getVideosByUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
