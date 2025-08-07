import api from "../lib/axios";

export const getAttendeesByEventId = async (eventId: number) => {
  const res = await api.get(`/organizers/events/${eventId}/attendees`);
  return res.data.data;
};