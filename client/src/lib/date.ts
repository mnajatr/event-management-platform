export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});
};