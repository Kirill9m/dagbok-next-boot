"use client";

import React, { useEffect, useState, useCallback } from "react";
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

  const startEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setDraftText(note.text);
  };

  const cancelEdit = useCallback(() => {
    setEditingNoteId(null);
    setDraftText("");
  }, []);

  const saveEdit = () => {
    if (editingNoteId == null || !onEdit) return;
    if (!draftText.trim()) {
      return;
    }
    onEdit(editingNoteId, draftText);
    cancelEdit();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editingNoteId !== null) {
          cancelEdit();
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, editingNoteId, cancelEdit]);

  return (
    <div
      className="fixed inset-0 bg-[#2A2A2A] sm:bg-black/50 sm:flex sm:items-center sm:justify-center z-50 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className="bg-[#2A2A2A] w-full h-full sm:h-auto sm:rounded-lg sm:max-w-3xl sm:max-h-[90vh] shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notes-modal-title"
      >
        <div className="sticky top-0 z-10 bg-[#2A2A2A] px-4 py-4 sm:px-6 border-b border-white/10 flex items-center justify-between">
          <h2
            id="notes-modal-title"
            className="text-xl sm:text-2xl font-semibold text-white"
          >
            Anteckningar
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-2 -mr-2"
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
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          {notesData?.notes.map((note, index) => {
            const isEditing = editingNoteId === note.id;

            return (
              <React.Fragment key={note.id}>
                <div className="relative">
                  <div className="prose prose-invert max-w-none">
                    {isEditing ? (
                      <textarea
                        className="rounded-lg p-4 w-full shadow-lg outline-none focus:ring-2 focus:ring-[#FF7518] bg-[#1A1A1A] min-h-[150px] text-left resize-none"
                        value={draftText}
                        onChange={(e) => setDraftText(e.target.value)}
                        rows={Math.max(5, draftText.split("\n").length)}
                        autoFocus
                      />
                    ) : (
                      <div className="bg-[#1A1A1A] rounded-lg p-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {note.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    {onEdit && !isEditing && (
                      <button
                        onClick={() => startEdit(note)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#FF7518] hover:bg-[#FF7518]/80 text-white rounded-lg transition"
                        aria-label="Redigera anteckning"
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
                        <span className="hidden sm:inline">Redigera</span>
                      </button>
                    )}

                    {onEdit && isEditing && (
                      <>
                        <button
                          onClick={saveEdit}
                          disabled={!draftText.trim()}
                          className={`flex items-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg transition ${
                            draftText.trim()
                              ? "bg-[#FF7518] hover:bg-[#FF7518]/80"
                              : "bg-[#FF7518]/50 cursor-not-allowed"
                          }`}
                          aria-label="Spara ändringar"
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Spara</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                          aria-label="Avbryt redigering"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span>Avbryt</span>
                        </button>
                      </>
                    )}

                    {onDelete && !isEditing && (
                      <button
                        onClick={() => onDelete(note.id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-700 hover:bg-red-600 text-white rounded-lg transition"
                        aria-label="Ta bort anteckning"
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
                        <span className="hidden sm:inline">Ta bort</span>
                      </button>
                    )}
                  </div>
                </div>

                {index < (notesData?.notes.length ?? 0) - 1 && (
                  <hr className="border-gray-700/50 my-6" />
                )}
              </React.Fragment>
            );
          })}

          {(!notesData || notesData.notes.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="w-16 h-16 text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-400 text-lg">Inga anteckningar</p>
            </div>
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
