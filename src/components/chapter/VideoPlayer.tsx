import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  poster?: string;
}

export default function VideoPlayer({
  videoUrl,
  title,
  poster,
}: VideoPlayerProps) {
  return (
    <Card className="overflow-hidden rounded-2xl p-0 shadow-xl">
      {title && (
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      )}

      <video
        controls
        preload="metadata"
        poster={poster}
        className="aspect-video w-full bg-black"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </Card>
  );
}