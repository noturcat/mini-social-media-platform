import api from "@/utils/api";
import { Person } from "@/types/person";

// Get all people
export const fetchpeople = async (): Promise<Person[]> => {
  const response = await api.get("/api/people");
  return response.data;
};

// Get person by ID
export const fetchPersonById = async (id: number): Promise<Person> => {
  const response = await api.get(`/api/people/${id}`);
  return response.data;
};

// Create a new person
export const createPerson = async (person: Partial<Person>) => {
  return await api.post("/api/people", person);
};

// Update person
export const updatePerson = async (id: number, person: Partial<Person>) => {
  return await api.put(`/api/people/${id}`, person);
};

// Delete person
export const deletePerson = async (id: number) => {
  return await api.delete(`/api/people/${id}`);
};
