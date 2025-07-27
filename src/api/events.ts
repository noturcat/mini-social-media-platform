import api from "@/utils/api";
import { Event } from "@/types/event";

// Get all events
export const fetchEvents = async (): Promise<Event[]> => {
  const response = await api.get("/api/events");
  return response.data;
};

// Get single event by ID
export const fetchEventById = async (id: number): Promise<Event> => {
  const response = await api.get(`/api/events/${id}`);
  return response.data;
};

// Create a new event
export const createEvent = async (event: Partial<Event>) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const person_id = user.id;

  return await api.post("/api/events", {
    ...event,
    person_id, // ✅ attach personal_id to the payload
  }); 
};

// Update existing event
export const updateEvent = async (id: number, event: Partial<Event>) => {
  return await api.put(`/api/events/${id}`, event);
};

// Delete event
export const deleteEvent = async (id: number) => {
  return await api.delete(`/api/events/${id}`);
};
