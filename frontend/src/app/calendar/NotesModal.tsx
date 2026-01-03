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
}

const NotesModal = ({ isOpen, onClose, notesData }: NotesModalProps) => {
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
    >
      <div className="bg-[#2A2A2A] rounded-lg p-0 w-full max-w-[95vw] sm:max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-2xl font-semibold text-white">Anteckningar</h2>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
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
              <div className="text-gray-200 text-base py-4 first:pt-0">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ul: (props) => (
                      <ul
                        className="list-disc ml-6 mb-4 space-y-1"
                        {...props}
                      />
                    ),
                    ol: (props) => (
                      <ol
                        className="list-decimal ml-6 mb-4 space-y-1"
                        {...props}
                      />
                    ),
                    li: (props) => <li className="mb-1" {...props} />,
                    h1: (props) => (
                      <h1
                        className="text-2xl font-bold mb-4 text-white"
                        {...props}
                      />
                    ),
                    h2: (props) => (
                      <h2
                        className="text-xl font-bold mb-3 mt-6 text-white"
                        {...props}
                      />
                    ),
                    p: (props) => (
                      <p
                        className="mb-4 leading-relaxed whitespace-pre-wrap"
                        {...props}
                      />
                    ),
                    hr: (props) => (
                      <hr className="border-gray-600 my-6" {...props} />
                    ),
                  }}
                >
                  {note.text}
                </ReactMarkdown>
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
