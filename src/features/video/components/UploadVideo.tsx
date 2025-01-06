import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { videoApi } from "../services/api/videoApi";

export const UploadVideo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };

    const handleVideoUpload = async () => {
        if (!title || !file) {
          setError("Please provide both a title and a file.");
          return;
        }
        try {
          await videoApi.uploadVideo({ title, file });
          alert("Upload successful!");
          onClose();
        } catch (err) {
          setError("Failed to upload video. Please try again.");
        }
    };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="video">Video</Label>
      <Input id="video" type="file" onChange={handleFileChange} />
      <Input 
        id="video-title" 
        type="text" 
        placeholder="Enter title" 
        onChange={(e) => setTitle(e.target.value)}
      />
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleVideoUpload}
      >
        Upload
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}