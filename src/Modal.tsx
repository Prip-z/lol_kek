import { ReactNode } from 'react'

interface ModalProps {
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({ onClose, children, className = '' }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-black/60 text-white text-xl leading-none flex items-center justify-center hover:bg-black"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}