import React, { useEffect, useState } from "react";
import axios from "axios";
import Base64Decode from "../components/Base64Decode";
import { useAuth } from "../context";

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

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-screen">
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md mb-6"></div>
            <div className="h-48 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-screen">
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Your Uploaded Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-5 mr-5">
        {videos.map((video, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">{video.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{video.description}</p>
              <div className="flex justify-center align-content-center">
                <Base64Decode base64String={video.videoData} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllVideos;