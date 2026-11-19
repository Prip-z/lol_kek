import { DragEvent, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cryptoRandomInt } from '@/shared/lib/random';

interface Props {
  onRawTextLoaded: (bits: string) => void;
  onError?: (err: Error) => void;
}

export function DragNDropComponent({ onRawTextLoaded, onError }: Props) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement | null>(null);
  const lastJumpTimeRef = useRef(0);

  const dodgeCursor = (e: DragEvent<HTMLDivElement>) => {
    if (e.shiftKey) return;

    const now = performance.now();
    if (now - lastJumpTimeRef.current < 180) return;
    lastJumpTimeRef.current = now;

    const el = boxRef.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const rect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const padding = 20;

    const currentRelX = rect.left - parentRect.left;
    const currentRelY = rect.top - parentRect.top;

    const baseRelX = currentRelX - offset.x;
    const baseRelY = currentRelY - offset.y;

    const maxRelX = Math.max(padding, parentRect.width - rect.width - padding);
    const visibleBottom = Math.min(parentRect.bottom, window.innerHeight) - parentRect.top;
    const maxRelY = Math.max(padding, visibleBottom - rect.height - padding);

    let targetRelX = currentRelX;
    let targetRelY = currentRelY;

    for (let attempt = 0; attempt < 10; attempt++) {
      const candidateX = padding + cryptoRandomInt(Math.max(1, Math.floor(maxRelX - padding)));
      const candidateY = padding + cryptoRandomInt(Math.max(1, Math.floor(maxRelY - padding)));

      if (Math.hypot(candidateX - currentRelX, candidateY - currentRelY) > 100) {
        targetRelX = candidateX;
        targetRelY = candidateY;
        break;
      }
    }

    setOffset({
      x: targetRelX - baseRelX,
      y: targetRelY - baseRelY,
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    async onDrop(acceptedFiles) {
      if (acceptedFiles.length === 0) return;

      setOffset({ x: 0, y: 0 });
      const file = acceptedFiles[0];

      try {
        const isTextFile =
          file.type.startsWith('text/') || file.name.toLowerCase().endsWith('.txt');

        if (isTextFile) {
          const trimmed = (await file.text()).trim();
          // Если в .txt не ровно 8 нулей/единиц, передаём пустую строку, чтобы convertor выдал ошибку формата
          onRawTextLoaded(/^[01]{8}$/.test(trimmed) ? trimmed : '');
          return;
        }

        const buf = await file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let bits = '';
        for (let i = 0; i < bytes.length; i++) {
          bits += bytes[i].toString(2).padStart(8, '0');
        }

        onRawTextLoaded(bits);
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error('Ошибка чтения файла'));
      }
    },
  });

  const rootProps = getRootProps({
    onDragEnter: dodgeCursor,
  });

  return (
    <div
      {...rootProps}
      ref={(node) => {
        boxRef.current = node;
        if (typeof rootProps.ref === 'function') {
          rootProps.ref(node);
        }
      }}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      className="relative z-20 py-5 px-10 border-3 border-white bg-laba cursor-pointer transition-transform duration-300 ease-out select-none"
    >
      <input {...getInputProps()} />
      <p>{isDragActive ? 'Принимаю...' : 'Грузим данные'}</p>
    </div>
  );
}