import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { fetchEvents, deleteEvent } from "@/api/events";
import { successSwal, errorSwal, confirmSwal, editEventSwal } from "@/utils/swal";
import ComposeEventBar from "@/components/events/ComposeEventBar";
import EventModal from "@/components/events/EventModal";
import FloatingCreateButton from "@/components/shared/FloatingCreateButton";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to reload posts:", err);
        errorSwal("Could not reload posts.");
      }
    }; 

  const handleDelete = async (id: number) => {
    const result = await confirmSwal("This event will be permanently deleted.");
    if (result.isConfirmed) {
      try {
        await deleteEvent(id);
        successSwal("Event deleted.");
        loadEvents();
      } catch {
        errorSwal("Failed to delete event.");
      }
    }
  };

  const handleEdit = async (event: Event) => {
    await editEventSwal(event, loadEvents);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 font-thin text-wanderer-text dark:text-white transition-colors duration-300">
      <ComposeEventBar onEventCreated={loadEvents}/>
      <h1 className="text-2xl font-elegant text-scara-gold dark:text-scara-gold mb-4">
        Events
      </h1>

      {events.map((event) => (
        <div
          key={event.id}
          className="p-4 mb-4 rounded-lg shadow border border-wanderer-border dark:border-scara-primary bg-wanderer-card dark:bg-scara-bg transition-all"
        >
          <h2 className="text-lg font-elegant text-wanderer-text dark:text-scara-gold">
            {event.title}
          </h2>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
            📍 {event.location}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🕒 {new Date(event.time).toLocaleString()}
          </p>
          <div className="flex justify-end gap-3 mt-3">
            <Link href={`/events/${event.id}`} key={event.id}>
              <button
                className="text-wanderer-primary dark:text-scara-card hover:underline"
              >
                View
              </button>
            </Link>
            <button
              onClick={() => handleEdit(event)}
              className="text-sm text-blue-500 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(event.id)}
              className="text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <FloatingCreateButton onClick={() => setIsModalOpen(true)} />
      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
