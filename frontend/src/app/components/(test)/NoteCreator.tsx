"use client";

import { useState } from "react";

const NoteCreator = () => {
  const [note, setNote] = useState("");
  const [jwt, setJwt] = useState("");

  const addNote = async () => {
    try {
      const response = await fetch(
        "${process.env.NEXT_PUBLIC_API_URL}/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ value: note }),
        },
      );

      if (!response) {
        throw new Error("No response from server");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getLastNote = async () => {
    try {
      const response = await fetch(
        "${process.env.NEXT_PUBLIC_API_URL}/api/notes/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      if (!response) {
        throw new Error("No response from server");
      }

      const data = await response.json();
      console.log(data);

      setNote(data.notes[data.notes.length - 1].value ?? "No notes found");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-col pt-3 gap-1">
        <input
          className="border border-gray-300 rounded-md"
          type="text"
          placeholder="JWT token"
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-md"
          type="text"
          placeholder="Value"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button onClick={addNote}>Save note</button>
      </div>
      <div className="flex flex-col pt-3 gap-1">
        <button onClick={getLastNote}>Get last note</button>
      </div>
    </>
  );
};

export default NoteCreator;
