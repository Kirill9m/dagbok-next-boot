"use client";

import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  onEdit?: (noteId: number) => void;
  onDelete?: (noteId: number) => void;
}

const NotesModal = ({
  isOpen,
  onClose,
  notesData,
  onEdit,
  onDelete,
}: NotesModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className="bg-[#2A2A2A] rounded-lg p-0 w-full max-w-[95vw] sm:max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notes-modal-title"
      >
        <div className="p-4 sm:p-6 border-b border-white/10">
          <h2
            id="notes-modal-title"
            className="text-2xl font-semibold text-white"
          >
            Anteckningar
          </h2>
        </div>

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

        <div className="p-4 sm:p-6 overflow-y-auto">
          {notesData?.notes.map((note, index) => (
            <React.Fragment key={note.id}>
              <div className="relative group">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {note.text}
                  </ReactMarkdown>
                </div>

                <div className="flex gap-2 mt-3">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(note.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm  hover:bg-[#FF7518] text-white rounded transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Redigera
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(note.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm hover:bg-red-700 text-white rounded transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Ta bort
                    </button>
                  )}
                </div>
              </div>
              {index < notesData.notes.length - 1 && (
                <hr className="border-gray-700 my-4" />
              )}
            </React.Fragment>
          ))}
          {(!notesData || notesData.notes.length === 0) && (
            <p className="text-gray-400 italic text-center">
              Inga anteckningar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
