import React, { useEffect, useState } from "react";

interface Base64DecodeProps {
  base64String: string;
}

const Base64Decode: React.FC<Base64DecodeProps> = ({ base64String }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const convertBase64ToVideo = () => {
      try {
        // Remove Base64 prefix (if present)
        const cleanedBase64 = base64String.replace(/^data:.*;base64,/, "");
        const binaryString = window.atob(cleanedBase64);
        const byteArray = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }

        // Create Blob and URL
        const blob = new Blob([byteArray], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        setVideoUrl(url);
      } catch (error) {
        console.error("Failed to decode Base64 video:", error);
      }
    };

    convertBase64ToVideo();

    // Cleanup function for revoking the Blob URL
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [base64String]);

  return (
    <div>
      {videoUrl ? (
        <video
          src={videoUrl}
          controls
          width={400}
          height={300}
          className="rounded-md shadow-md"
        />
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default Base64Decode;
