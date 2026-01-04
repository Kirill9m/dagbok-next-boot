"use client";

import React, { useEffect, useState } from "react";
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
  onEdit?: (noteId: number, nextText: string) => void;
  onDelete?: (noteId: number) => void;
}

const NotesModalContent = ({
  onClose,
  notesData,
  onEdit,
  onDelete,
}: Omit<NotesModalProps, "isOpen">) => {
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const startEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setDraftText(note.text);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setDraftText("");
  };

  const saveEdit = () => {
    if (editingNoteId == null || !onEdit) return;
    onEdit(editingNoteId, draftText);
    cancelEdit();
  };

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
          {notesData?.notes.map((note, index) => {
            const isEditing = editingNoteId === note.id;

            return (
              <React.Fragment key={note.id}>
                <div className="relative group">
                  <div className="prose prose-invert max-w-none">
                    {isEditing ? (
                      <textarea
                        className="relative rounded-lg p-6 w-full shadow-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-[#1A1A1A] min-h-[100px] text-left resize-none"
                        value={draftText}
                        onChange={(e) => setDraftText(e.target.value)}
                        rows={5}
                      />
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {note.text}
                      </ReactMarkdown>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    {onEdit && !isEditing && (
                      <button
                        onClick={() => startEdit(note)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#FF7518]/70 hover:bg-[#FF7518] text-white rounded transition"
                      >
                        Redigera
                      </button>
                    )}

                    {onEdit && isEditing && (
                      <>
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1.5 text-sm bg-[#FF7518]/70 hover:bg-[#FF7518] text-white rounded transition"
                        >
                          Spara
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1.5 text-sm bg-gray-700/70 hover:bg-gray-700 text-white rounded transition"
                        >
                          Avbryt
                        </button>
                      </>
                    )}

                    {onDelete && !isEditing && (
                      <button
                        onClick={() => onDelete(note.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-700/70 hover:bg-red-700 text-white rounded transition"
                      >
                        Ta bort
                      </button>
                    )}
                  </div>
                </div>

                {index < (notesData?.notes.length ?? 0) - 1 && (
                  <hr className="border-gray-700 my-4" />
                )}
              </React.Fragment>
            );
          })}

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

const NotesModal = ({
  isOpen,
  onClose,
  notesData,
  onEdit,
  onDelete,
}: NotesModalProps) => {
  if (!isOpen) return null;
  return (
    <NotesModalContent
      onClose={onClose}
      notesData={notesData}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default NotesModal;
