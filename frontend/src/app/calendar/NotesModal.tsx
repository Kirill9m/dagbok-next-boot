import React from "react";

const NotesModal = ({
  isOpen,
  onClose,
  notes,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onSave: (newNotes: string) => void;
}) => {
  const [text, setText] = React.useState(notes);
  if (!isOpen) return null;

  const handleSave = () => {
    onSave(text);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Redigera anteckningar</h2>
        <textarea
          className="w-full h-40 border border-gray-300 rounded-md p-2 mb-4"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={onClose}
          >
            Avbryt
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSave}
          >
            Spara
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
