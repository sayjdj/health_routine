const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export default function YouTubePlayer({ youtubeId }) {
  if (!youtubeId) return <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">No Video</div>;

  if (!YOUTUBE_ID_REGEX.test(youtubeId)) {
    return (
      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-red-500 p-4 text-center">
        Invalid YouTube Video ID
      </div>
    );
  }

  return (
    <div className="w-full aspect-video relative overflow-hidden bg-black shadow-md">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}
