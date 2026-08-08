import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  videoUrl: string;
  poster?: string;
  title?: string;
}

export default function VideoPlayer({
  videoUrl,
  poster,
  title,
}: VideoPlayerProps) {
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
        preload="metadata"
        poster={poster}
        className="aspect-video w-full bg-black"
      >
        <source src={videoUrl} type="video/mp4" />

        Your browser does not support the video tag.
      </video>
    </Card>
  );
}