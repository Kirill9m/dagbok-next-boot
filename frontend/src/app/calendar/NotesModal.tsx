import React from "react";

const NotesModal = ({
  isOpen,
  onClose,
  notes,
}: {
  isOpen: boolean;
  onClose: () => void;
  notes: string[];
}) => {
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
    >
      <div className="bg-[#2A2A2A] rounded-lg p-6 w-96 max-w-[90vw] shadow-2xl relative">
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

        <h2 className="text-xl font-bold mb-4 text-white">Anteckningar</h2>

        <div className="w-full h-40 p-3 rounded-lg bg-[#3A3A3A] text-white border border-white/10 mb-4 overflow-y-auto">
          {notes.map((note, index) => (
            <div key={index} className="mb-2 whitespace-pre-wrap">
              {note}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
