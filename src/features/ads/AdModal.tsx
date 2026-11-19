import { useEffect, useRef, useState } from 'react';
import { RoflDialog } from '@/shared/ui/RoflDialog';
import { assetUrl } from '@/shared/lib/assets';

interface AdModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdModal({ open, onClose }: AdModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!open) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    video.muted = false;
    video.volume = 1;
    video.play().catch(() => setBlocked(true));
  }, [open]);

  const unmuteAndPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    video.play().catch(() => {});
    setBlocked(false);
  };

  return (
    <RoflDialog open={open} onRealClose={onClose}>
      <video
        ref={videoRef}
        src={assetUrl('musor_drop.mp4')}
        className="w-full block"
        loop
        playsInline
      />
      {blocked && (
        <button
          type="button"
          onClick={unmuteAndPlay}
          className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xl font-bold cursor-pointer"
        >
          Включить звук
        </button>
      )}
    </RoflDialog>
  );
}