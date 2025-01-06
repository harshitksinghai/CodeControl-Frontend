import apiClient from '../../../../config/axiosConfig.ts';
import { UploadVideoRequest } from '../../utils/videoApiTypes.ts';
import { CommonResponse } from '../../../../utils/commonTypes';

export const videoApi = {
    /**
     * Upload a video file with title.
     * @param data - Object containing title and file.
     */
    uploadVideo: (data: UploadVideoRequest) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("file", data.file);

        return apiClient.post<CommonResponse>(`/video/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    getStreamUrl: (videoId: string, quality?: string) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        if (quality === 'adaptive') {
            return `${baseUrl}/api/video/stream/${videoId}/master.m3u8`;
        }
        return `${baseUrl}/api/video/stream/${videoId}/${quality}/playlist.m3u8`;
    }
};