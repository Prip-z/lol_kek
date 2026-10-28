import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";

export function Home() {
    const [showPhoto, setShowPhoto] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (!showPhoto) return
        if (!audioRef.current) {
            audioRef.current = new Audio('/zvonok-skype-no-eto-gromko.mp3')
            audioRef.current.loop = true
        }
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
        }
    }, [showPhoto])

    return (
        <>
        <div className="bg-laba w-screen h-screen flex-row">
            <img
                src="a14cdded9e1f82cad41681232b657e0a.jpg"
                className="w-screen h-60 border-2 cursor-pointer"
                onClick={() => setShowPhoto(true)}
            />
            <p className="text-white p-5">ТУТ МОГЛА БЫТЬ ВАША РЕКЛАМА</p>
        </div>

        {showPhoto && (
            <Modal onClose={() => setShowPhoto(false)} className="max-w-md bg-black">
                <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                    <img
                        src="6f0ebf291422a4daab23c53759b1b5ea.jpg"
                        className="block w-full h-auto cursor-pointer"
                    />
                </a>
            </Modal>
        )}
        </>
    )
}