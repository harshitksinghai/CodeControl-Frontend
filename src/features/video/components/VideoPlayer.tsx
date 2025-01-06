import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Hls from 'hls.js';
import toast from 'react-hot-toast';
import { videoApi } from '../services/api/videoApi';

interface VideoPlayerProps {
    videoId: string;
}

function VideoPlayer({ videoId }: VideoPlayerProps): JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Player | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [quality, setQuality] = useState<string>('adaptive');
    // Change the ref type to handle both number and undefined
    const currentTimeRef = useRef<number | undefined>(0);

    const qualities = [
        { value: 'adaptive', label: 'Adaptive' },
        { value: '360p', label: '360p' },
        { value: '480p', label: '480p' },
        { value: '720p', label: '720p' },
        { value: '1080p', label: '1080p' },
    ] as const;

    const handlePlay = async (player: Player) => {
        try {
            // Add null check for currentTimeRef.current
            const currentTime = currentTimeRef.current;
            if (typeof currentTime === 'number' && currentTime > 0) {
                player.currentTime(currentTime);
            }
            const playPromise = player.play();
            if (playPromise !== undefined) {
                await playPromise;
            }
        } catch (error) {
            console.error('Error playing video:', error);
            toast.error('Failed to play video');
        }
    };

    const initializeVideo = (): Player | null => {
        if (!containerRef.current) return null;
        
        const videoElement = document.createElement('video');
        videoElement.className = 'video-js vjs-big-play-button vjs-control-bar';
        containerRef.current.appendChild(videoElement);

        const player = videojs(videoElement, {
            controls: true,
            autoplay: true,
            muted: true,
            preload: 'auto',
            width: '500px'
        });

        // Handle the potential undefined return value from currentTime()
        player.on('timeupdate', () => {
            const time = player.currentTime();
            if (typeof time === 'number') {
                currentTimeRef.current = time;
            }
        });

        return player;
    };

    const loadVideo = (streamUrl: string) => {
        if (!playerRef.current) {
            const newPlayer = initializeVideo();
            if (!newPlayer) return;
            playerRef.current = newPlayer;
        }

        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        if (Hls.isSupported()) {
            const hls = new Hls({
                xhrSetup: (xhr) => {
                    xhr.withCredentials = true;
                },
                debug: true
            });

            hlsRef.current = hls;
            hls.loadSource(streamUrl);

            const videoElement = playerRef.current?.el()?.querySelector('video');
            if (videoElement) {
                hls.attachMedia(videoElement as HTMLVideoElement);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (playerRef.current) {
                        handlePlay(playerRef.current);
                    }
                });

                hls.on(Hls.Events.ERROR, (_, data) => {
                    if (data.fatal) {
                        console.error('HLS Error:', data);
                        toast.error('Video stream error');
                    }
                });
            }
        } else if (playerRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
            playerRef.current.src({
                src: streamUrl,
                type: 'application/vnd.apple.mpegurl',
                withCredentials: true
            });

            playerRef.current.on('loadedmetadata', () => {
                if (playerRef.current) {
                    handlePlay(playerRef.current);
                }
            });
        } else {
            toast.error('HLS playback not supported in this browser');
        }
    };

    useEffect(() => {
        const streamUrl = videoApi.getStreamUrl(videoId, quality);
        loadVideo(streamUrl);

        return () => {
            hlsRef.current?.destroy();
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [videoId, quality]);

    return (
        <div className="w-full h-[500px] flex flex-col space-y-4">
            <div data-vjs-player className="relative">
                <div ref={containerRef} />
            </div>
            <div className="flex items-center space-x-2 mt-16">
                <span className="text-sm font-medium">Quality:</span>
                <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                        {qualities.map((q) => (
                            <SelectItem key={q.value} value={q.value}>
                                {q.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

export default VideoPlayer;