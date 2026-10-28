import React, { useEffect, useRef } from 'react';

const VideoComponent = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });

    const unlock = () => {
      video.muted = false;
      video.play().catch(() => {});
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  return (
    <a
      href="https://character.ai/chat/M0YIZ4i54JycNiWEa12UB72z8arRjSVvLc-MqK6D40c"
      className="block w-full h-40"
    >
      <video
        ref={videoRef}
        src="/Download.mp4"
        autoPlay
        loop
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'fill' }}
      />
    </a>
  );
};

export default VideoComponent;