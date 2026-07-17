interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({
  videoUrl,
}: VideoPlayerProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-black shadow">
      <video
        controls
        className="aspect-video w-full"
        src={videoUrl}
      />
    </div>
  );
}