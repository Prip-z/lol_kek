import { useEffect, useRef, useState } from 'react'
import { Modal } from './Modal'

interface AdModalProps {
  onClose: () => void
}

export function AdModal({ onClose }: AdModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    video.volume = 1
    video.play().catch(() => setBlocked(true))
  }, [])

  const unmuteAndPlay = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    video.volume = 1
    video.play().catch(() => {})
    setBlocked(false)
  }

  return (
    <Modal onClose={onClose}>
      <video
        ref={videoRef}
        // ИСПРАВЛЕНО ТУТ:
        src={`${import.meta.env.BASE_URL}musor_drop.mp4`}
        className="w-full block"
        autoPlay
        loop
        playsInline
      />
      {blocked && (
        <button
          onClick={unmuteAndPlay}
          className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xl font-bold"
        >
          🔊 Включить звук
        </button>
      )}
    </Modal>
  )
}