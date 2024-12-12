import React, { useEffect, useState } from "react";
import axios from "axios";
import Base64Decode from "../components/Base64Decode";
import { useAuth } from "../context"; // Assuming Context.tsx is in the same directory

interface Video {
  title: string;
  description: string;
  videoData: string; // Base64 encoded video data
}

const AllVideos: React.FC = () => {
  const { token } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!token) throw new Error("User is not authenticated.");
        
        const response = await axios.get("http://localhost:8080/videos/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const videoData: Video[] = response.data.videos;
        setVideos(videoData);
      } catch (err: any) {
        console.error("Error fetching videos:", err.response?.data || err.message);
        setError(err.message || "Failed to fetch videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [token]);

  if (loading) return <p>Loading videos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Uploaded Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-medium mb-2">{video.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{video.description}</p>
            <Base64Decode base64String={video.videoData} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllVideos;
