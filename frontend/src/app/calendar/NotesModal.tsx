"use client";

import React, { useEffect, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckIcon, EditIcon, XIcon } from "@/app/components/icons";

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
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#2A2A2A] sm:flex sm:items-center sm:justify-center sm:bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className="flex h-full w-full flex-col bg-[#2A2A2A] shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notes-modal-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#2A2A2A] px-4 py-4 sm:px-6">
          <h2
            id="notes-modal-title"
            className="text-xl font-semibold text-white sm:text-2xl"
          >
            Anteckningar
          </h2>
          <button
            onClick={onClose}
            className="-mr-2 flex min-h-[48px] min-w-[48px] touch-manipulation items-center justify-center p-3 text-gray-400 transition-all duration-100 select-none [-webkit-tap-highlight-color:transparent] hover:text-white active:scale-95 active:text-gray-300 sm:min-h-0 sm:min-w-0 sm:p-2"
            aria-label="Stäng"
          >
            <XIcon className="h-10 w-10 sm:h-6 sm:w-6" />
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
                        className="min-h-[150px] w-full resize-none rounded-lg bg-[#1A1A1A] p-4 text-left shadow-lg outline-none focus:ring-2 focus:ring-[#FF7518]"
                        value={draftText}
                        onChange={(e) => setDraftText(e.target.value)}
                        rows={Math.max(5, draftText.split("\n").length)}
                        autoFocus
                      />
                    ) : (
                      <div className="rounded-lg bg-[#1A1A1A] p-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {note.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    {onEdit && !isEditing && (
                      <button
                        onClick={() => startEdit(note)}
                        className="flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-1.5 rounded-lg bg-[#FF7518] px-6 py-3 text-base font-medium text-white transition-all duration-100 select-none [-webkit-tap-highlight-color:transparent] hover:bg-[#FF7518]/80 active:scale-[0.98] active:brightness-90 sm:min-h-[auto] sm:w-auto sm:px-3 sm:py-2 sm:text-sm"
                        aria-label="Redigera anteckning"
                      >
                        <EditIcon className="h-6 w-6 flex-shrink-0 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Redigera</span>
                      </button>
                    )}

                    {onEdit && isEditing && (
                      <>
                        <button
                          onClick={saveEdit}
                          disabled={!draftText.trim()}
                          className={`flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-medium text-white transition-all duration-100 select-none [-webkit-tap-highlight-color:transparent] sm:min-h-[auto] sm:w-auto sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm ${
                            draftText.trim()
                              ? "bg-[#FF7518] hover:bg-[#FF7518]/80 active:scale-[0.98] active:brightness-90"
                              : "cursor-not-allowed bg-[#FF7518]/50 opacity-60"
                          }`}
                          aria-label="Spara ändringar"
                        >
                          <CheckIcon className="h-5 w-5 flex-shrink-0 sm:h-4 sm:w-4" />
                          <span>Spara</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-lg bg-gray-700 px-6 py-3 text-base font-medium text-white transition-all duration-100 select-none [-webkit-tap-highlight-color:transparent] hover:bg-gray-600 active:scale-[0.98] active:brightness-90 sm:min-h-[auto] sm:w-auto sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm"
                          aria-label="Avbryt redigering"
                        >
                          <XIcon className="h-6 w-6" />
                          <span>Avbryt</span>
                        </button>
                      </>
                    )}

                    {onDelete && !isEditing && (
                      <button
                        onClick={() => onDelete(note.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-2 text-sm text-white transition hover:bg-red-600"
                        aria-label="Ta bort anteckning"
                      >
                        <svg
                          className="h-4 w-4"
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
                  <hr className="my-6 border-gray-700/50" />
                )}
              </React.Fragment>
            );
          })}

          {(!notesData || notesData.notes.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="mb-4 h-16 w-16 text-gray-600"
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
              <p className="text-lg text-gray-400">Inga anteckningar</p>
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
