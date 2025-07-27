import { useState } from "react";
import { createEvent } from "@/api/events";
import { successSwal, errorSwal } from "@/utils/swal";

export default function ComposeEventBar({ onEventCreated }: { onEventCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async () => {
    if (!title || !location || !time) return errorSwal("Title,Location and Date&Time are required");

    try {
        await createEvent({ title, location, time });
        await successSwal("Event posted!");
        setTitle("");
        setLocation("");
        setTime("");
        onEventCreated();
      } catch {
        errorSwal("Failed to create event.");
      }
  }; 
  return (
    <div className="hidden md:block p-4 mb-6 rounded-lg shadow border border-wanderer-border dark:border-scara-primary bg-wanderer-card dark:bg-scara-bg text-wanderer-text dark:text-white font-thin transition-colors duration-300">
      <h2 className="text-lg font-elegant mb-3 text-scara-gold dark:text-scara-gold">
        Create Event
      </h2>

      <input
        type="text"
        placeholder="Event Title"
        className="w-full mb-2 p-2 rounded border border-wanderer-border dark:border-scara-primary bg-transparent text-sm placeholder-scara-accent"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        className="w-full mb-2 p-2 rounded border border-wanderer-border dark:border-scara-primary bg-transparent text-sm placeholder-scara-accent"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="datetime-local"
        className="w-full mb-3 p-2 rounded border border-wanderer-border dark:border-scara-primary bg-transparent text-sm placeholder-scara-accent"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-wanderer-accent dark:bg-scara-primary text-white rounded hover:bg-wanderer-hover dark:hover:bg-scara-accent font-elegant transition"
        >
          Post Event
        </button>
      </div>
    </div>
  );
}
