import { useEffect, useRef, useState } from 'react';
import { DragNDropComponent } from './DragNDropComponent';
import { TruthTable } from './TruthTable';
import { convertor } from '@/entities/logic/convertor';
import { GetPCNF, GetPDNF } from '@/entities/logic/discretka';
import { assetUrl } from '@/shared/lib/assets';
import { ScratchCard } from '@/shared/ui/ScratchCard';

export function LabaOne() {
  const [textRaw, setTextRaw] = useState<number[]>([]);
  const [pdnf, setPDNF] = useState('');
  const [pcnf, setPCNF] = useState('');
  const [isWork, setIsWork] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isWork) {
      if (!audioRef.current) {
        audioRef.current = new Audio(assetUrl('explosion-meme_dTCfAHs.mp3'));
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isWork]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  function handleTextFromFile(text: string) {
    setError(null);
    let raw: number[];

    try {
      raw = convertor(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Некорректный формат');
      return;
    }

    setPDNF(GetPDNF(raw));
    setPCNF(GetPCNF(raw));
    setIsWork(true);
    setTextRaw(raw);
  }

  return (
    <div className="bg-laba flex-1 min-h-screen text-white flex flex-col items-center gap-5 p-6 font-medium overflow-x-hidden">
      <p className="text-center max-w-2xl">
        Загрузите текстовый файл с одной строкой из 8 нулей и единиц в формате "11111111" или любой файл хех
      </p>
      <p className="text-center text-sm text-zinc-400">
        Обратите внимание: программа работает строго со строками из 8 символов, другое количество — харам
      </p>

      <DragNDropComponent onRawTextLoaded={handleTextFromFile} />

      {error && <div className="text-red-400 font-bold">{error}</div>}

      {isWork && (
        <ScratchCard resetKey={textRaw.join('')}>
          <p className="font-mono text-emerald-300">
            {pdnf !== '' ? `СДНФ: ${pdnf}` : ''}
          </p>
          <p className="font-mono text-sky-300">
            {pcnf !== '' ? `СКНФ: ${pcnf}` : ''}
          </p>
          <TruthTable raw={textRaw} />
        </ScratchCard>
      )}
    </div>
  );
}