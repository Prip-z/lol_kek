import { useRef, useState } from 'react'

interface IntroVideoProps {
  onEnd: () => void
}

export function IntroVideo({ onEnd }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  const handleStart = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    video.volume = 1
    video.play().catch(() => {
      onEnd()
    })
    setStarted(true)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src="/0f40ac7ed08065e1831991d0be42b6af.mp4"
        className="w-full h-full object-contain"
        playsInline
        onEnded={onEnd}
        onError={onEnd}
        preload="auto"
      />
      {!started && (
        <button
          onClick={handleStart}
          className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-2xl font-semibold cursor-pointer"
        >
          ▶ Начать
        </button>
      )}
    </div>
  )
}