import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { cryptoRandomInt } from '../lib/random';

interface RoflDialogProps {
  open: boolean;
  onRealClose: () => void;
  adRedirectUrl?: string;
  children: ReactNode;
  className?: string;
}

const CORNERS = [
  'top-2 right-2',
  'top-2 left-2',
  'bottom-2 right-2',
  'bottom-2 left-2',
] as const;

export function RoflDialog({
  open,
  onRealClose,
  adRedirectUrl = 'https://character.ai/chat/M0YIZ4i54JycNiWEa12UB72z8arRjSVvLc-MqK6D40c',
  children,
  className = '',
}: RoflDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const realCloseIndex = useMemo(() => {
    if (!open) return 0;
    return cryptoRandomInt(4);
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCloseAttempt = (index: number) => {
    if (index === realCloseIndex) {
      onRealClose();
    } else {
      window.open(adRedirectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => e.preventDefault()}
      className={`m-auto relative rounded-xl overflow-hidden bg-zinc-900/90 text-white shadow-2xl max-w-2xl w-full p-0 backdrop:bg-black/45 backdrop:backdrop-blur-sm ${className}`}
    >
      {CORNERS.map((posClass, idx) => (
        <button
          key={posClass}
          type="button"
          aria-label="Закрыть"
          onClick={() => handleCloseAttempt(idx)}
          className={`absolute ${posClass} z-20 w-8 h-8 rounded-full bg-black/70 text-white text-lg leading-none flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer`}
        >
          ×
        </button>
      ))}
      <div className="relative">{children}</div>
    </dialog>
  );
}