import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

interface ScratchCardProps {
  children: ReactNode;
  resetKey?: string | number;
}

export function ScratchCard({ children, resetKey }: ScratchCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const [scratchedPercent, setScratchedPercent] = useState(0);

  const paintCover = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    if (width === 0 || height === 0) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#9ca3af');
    grad.addColorStop(0.5, '#d1d5db');
    grad.addColorStop(1, '#6b7280');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Защитная сетка и текст поверх
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ПОТРИТЕ МОНЕТКОЙ, ЧТОБЫ УВИДЕТЬ ОТВЕТ', width / 2, height / 2);

    setScratchedPercent(0);
  }, []);

  useEffect(() => {
    paintCover();

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      paintCover();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [paintCover, resetKey]);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 30;

    ctx.beginPath();
    if (lastPosRef.current) {
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    } else {
      ctx.moveTo(x, y);
    }
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPosRef.current = { x, y };
  };

  const calculateCleared = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    const step = 16 * 4;
    for (let i = 3; i < data.length; i += step) {
      if (data[i] === 0) transparentPixels++;
    }
    const totalSampled = Math.ceil(data.length / step);
    setScratchedPercent(Math.round((transparentPixels / totalSampled) * 100));
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4 text-xs text-zinc-400">
        <button
          type="button"
          onClick={paintCover}
          className="underline hover:text-white cursor-pointer"
        >
          Замазать обратно
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative p-6 rounded-xl border-2 border-dashed border-amber-400/70 bg-zinc-900/80 select-none overflow-hidden"
      >
        {/* Сам контент (СДНФ, СКНФ и таблица) */}
        <div className="flex flex-col items-center gap-4">{children}</div>

        {/* Стираемый canvas поверх */}
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            isDrawingRef.current = true;
            lastPosRef.current = null;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratchAt(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!isDrawingRef.current) return;
            scratchAt(e.clientX, e.clientY);
          }}
          onPointerUp={(e) => {
            if (!isDrawingRef.current) return;
            isDrawingRef.current = false;
            lastPosRef.current = null;
            e.currentTarget.releasePointerCapture(e.pointerId);
            calculateCleared();
          }}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
      </div>
    </div>
  );
}