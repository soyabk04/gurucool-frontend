import { useRef } from "react";
import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  videoUrl: string;
  poster?: string;
  title?: string;

  onProgress?: (watchedDuration: number) => void;
  onEnded?: (watchedDuration: number) => void;
}

export default function VideoPlayer({
  videoUrl,
  poster,
  title,
  onProgress,
  onEnded,
}: VideoPlayerProps) {
  const lastSavedTime = useRef(0);

  const handleTimeUpdate = (
    event: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const video = event.currentTarget;

    // Save progress approximately every 10 seconds
    if (video.currentTime - lastSavedTime.current < 10) {
      return;
    }

    lastSavedTime.current = video.currentTime;

    onProgress?.(Math.floor(video.currentTime));
  };

  const handleEnded = (
    event: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const video = event.currentTarget;

    const watchedDuration = Math.floor(
      video.duration || video.currentTime
    );

    onEnded?.(watchedDuration);
  };

  return (
    <Card className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {title && (
        <div className="border-b px-4 py-3">
          <h2 className="truncate text-sm font-medium">
            {title}
          </h2>
        </div>
      )}

      <video
        controls
        controlsList="nodownload"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="aspect-video w-full bg-black"
      >
        <source
          src={videoUrl}
          type="video/mp4"
        />

        Your browser does not support the video tag.
      </video>
    </Card>
  );
}