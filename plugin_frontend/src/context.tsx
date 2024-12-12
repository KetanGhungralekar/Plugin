import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// Define types for user, video data, and context
interface User {
  email: string;
  username: string;
  role: string;
  token: string;
}

type VideoRequest = {
    title: string;
    description: string;
    role: string; // Replace with your USER_ROLE type if defined
    uploadedBy: string;
    videoFile: File; // File object for uploading
};
  
  // Define the VideoResponse type
type VideoResponse = {
    title: string;
    description: string;
    videoFilePath: string;
};


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
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

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
      localStorage.setItem("token", token);
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
      localStorage.setItem("token", token);
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

  const API_BASE_URL = "http://localhost:8080/videos";

    const uploadVideo = async (videoRequest: VideoRequest) => {
        try {
        if (!token) throw new Error("User is not authenticated.");
    
        // Create FormData object for multipart file upload
        const formData = new FormData();
        formData.append("title", videoRequest.title);
        formData.append("description", videoRequest.description);
        formData.append("role", videoRequest.role);
        formData.append("uploadedBy", videoRequest.uploadedBy);
        formData.append("videoFile", videoRequest.videoFile);
    
        await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
    
        console.log("Video uploaded successfully!");
        } catch (error: any) {
        console.error("Upload video error:", error.response?.data || error.message);
        throw error;
        }
    };
  
    

    // Get videos by user function
    const getVideosByUser = async (): Promise<VideoResponse[]> => {
        try {
          if (!token) throw new Error("User is not authenticated.");
      
          const response = await axios.get(`${API_BASE_URL}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          const data: VideoResponse[] = response.data.videos;
          console.log("Fetched videos by user:", data);
          return data;
        } 
        catch (error: any) {
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
