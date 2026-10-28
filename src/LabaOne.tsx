import { useEffect, useRef, useState } from "react";
import { DragNDropComponent } from "./DragNDropComponent";
import { convertor } from "./logic/convertor";
import { GetPCNF, GetPDNF } from "./logic/discretka";
import { TruthTable } from "./logic/TruthTable";

export function LabaOne() {
    const [textRaw, setTextRaw] = useState<number[]>([])
    const [pdnf, setPDNF] = useState('')
    const [pcnf, setPCNF] = useState('')
    const [isWork, setIsWork] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (isWork) {
            if (!audioRef.current) {
                audioRef.current = new Audio('/explosion-meme_dTCfAHs.mp3')
            }
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(() => {})
        } else {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
        }
    }, [isWork])

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    function handleTextFromFile(text: string) {
        setError(null)
        let raw: number[]

        try {
            raw = convertor(text);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Некорректный формат')
            return;
        }

        setPDNF(GetPDNF(raw))
        setPCNF(GetPCNF(raw))
        setIsWork(true)
        setTextRaw(raw)
    }

    return (
        <div className="bg-laba w-screen h-screen text-white flex flex-col items-center gap-5 font-medium">
            <p>Загрузите текстовый файл с одной строкой, состоящей только из единиц и нулей в формате "11111111" или загрузите любой файл хех</p>
            <p>Обратите внимание, что программа работает строго со строками из 8 символлов, т.е считать строку с другими количеством символов - харам</p>

            <DragNDropComponent onRawTextLoaded={handleTextFromFile}/>
            {error && <div className="error">{error}</div>}
            <p>{pdnf !== "" ? "СДНФ: " + pdnf : ""}</p> 
            <p>{pcnf !== "" ? "СКНФ: " + pcnf : ""}</p> 
            {isWork ? <TruthTable raw={textRaw}/> : <></> }
        </div>
    )
}