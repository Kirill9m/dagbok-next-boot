import React, { useEffect } from "react";

interface Note {
  id: number;
  text: string;
}

interface NotesData {
  notes: Note[];
}

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notesData: NotesData | null;
}

const NotesModal = ({ isOpen, onClose, notesData }: NotesModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="bg-[#2A2A2A] rounded-lg p-6 w-96 max-w-[90vw] shadow-2xl relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Stäng"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 id="modal-title" className="text-xl font-bold mb-4 text-white">
          Anteckningar
        </h2>

        <div className="w-full h-40 p-3 rounded-lg bg-[#3A3A3A] text-white border border-white/10 mb-4 overflow-y-auto">
          {notesData?.notes.map((note) => (
            <div key={note.id} className="mb-2 whitespace-pre-wrap">
              {note.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
