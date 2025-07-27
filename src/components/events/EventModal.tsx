import { useState } from "react";
import { createEvent } from "@/api/events";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({ isOpen, onClose }: EventModalProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async () => {
    if (!title || !location || !time) return;
    await createEvent({ title, location, time });
    setTitle("");
    setLocation("");
    setTime("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center md:hidden">
      <div className="bg-wanderer-card dark:bg-scara-bg border border-wanderer-border dark:border-scara-primary text-wanderer-text dark:text-white p-6 w-full mx-4 rounded-lg shadow-lg relative max-w-md font-thin transition-colors duration-300">
        
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-wanderer-accent dark:text-scara-gold hover:text-black dark:hover:text-white"
        >
          ×
        </button>

        <h2 className="text-lg font-elegant text-scara-gold dark:text-scara-gold mb-4">
          Create Event
        </h2>

        <input
          type="text"
          placeholder="Event Title"
          className="w-full mb-2 p-2 border border-wanderer-border dark:border-scara-primary bg-transparent text-sm rounded placeholder-wanderer-accent dark:placeholder-scara-accent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full mb-2 p-2 border border-wanderer-border dark:border-scara-primary bg-transparent text-sm rounded placeholder-wanderer-accent dark:placeholder-scara-accent"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="datetime-local"
          className="w-full mb-3 p-2 border border-wanderer-border dark:border-scara-primary bg-transparent text-sm rounded placeholder-wanderer-accent dark:placeholder-scara-accent"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-wanderer-accent dark:bg-scara-primary hover:bg-wanderer-hover dark:hover:bg-scara-accent text-white py-2 rounded transition font-elegant"
        >
          Post Event
        </button>
      </div>
    </div>
  );
}
