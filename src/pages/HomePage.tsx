import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../features/auth/services/api/authApi.ts';
import { Minus, Plus } from "lucide-react";
import { UploadVideo } from '@/features/video/components/UploadVideo.tsx';
import VideoPlayer from '@/features/video/components/VideoPlayer.tsx';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [showUpload, setShowUpload] = useState(false);
  const [videoId, setVideoId] = useState("db58a35a-b303-4ac6-b48f-3cdff8de9269");


  const handleLogout = async () => {
    try {
      console.log("calling: authApi.logout()");
      await authApi.logout();
      console.log("worked: authApi.logout()");

      navigate('/');
    } catch (err) {
      console.error('Logout failed');
    }
  };

  return (
    <div>
      <h1>Welcome Home</h1>
      <br />


      <div className="p-4">
        <button
          onClick={() => setShowUpload(true)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Plus size={20} />
        </button>

        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <UploadVideo onClose={() => setShowUpload(false)} />
            </div>
            <button
              onClick={() => setShowUpload(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Minus size={20} />
            </button>
          </div>
        )}
      </div>
      <br />
      <br />
      {videoId && <VideoPlayer videoId={videoId} />}
      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Playing Video</h2>
        <VideoPlayer videoId={videoId} />
      </div> */}
      {/* <div>
        <VideoPlayer
          src={`http://localhost:8080/api/video/${videoId}/master.m3u8`}
        ></VideoPlayer>
      </div> */}
      <br />
      {/* <div>
        <video src="http://localhost:8080/api/video/stream/06b1ff6c-c917-44b6-8f8c-e37970fc24da" controls></video>
      </div> */}
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;