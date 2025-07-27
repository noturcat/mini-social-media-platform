import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { fetchEventById } from "@/api/events";
import Link from 'next/link';

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventById(Number(id))
        .then(setEvent)
        .catch(() => setEvent(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!event) return <p className="text-center">Event not found</p>;

  return (
    <main className="max-w-2xl mx-auto mt-10 p-6 bg-wanderer-card dark:bg-scara-bg border border-wanderer-border dark:border-scara-primary rounded-lg shadow font-thin text-wanderer-text dark:text-white">
      <h1 className="text-2xl font-elegant text-scara-gold dark:text-scara-gold mb-4">
        📅 {event.title}
      </h1>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
        📍 <span className="italic">{event.location}</span>
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        🕒 {new Date(event.time).toLocaleString()}
      </p>

      <div className="mt-6 text-right">
        <Link href="/events" className="text-sm text-blue-500 hover:underline">
          ← Back to Events
        </Link>
      </div>
    </main>
  );
}
