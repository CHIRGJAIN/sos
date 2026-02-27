import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";

export const formatDateTime = (iso: string) => format(new Date(iso), "dd MMM yyyy, HH:mm");

export const formatShortTime = (iso: string) => format(new Date(iso), "HH:mm");

export const formatRelative = (iso: string) =>
  formatDistanceToNowStrict(new Date(iso), { addSuffix: true });

export const groupTimelineLabel = (iso: string) => {
  const date = new Date(iso);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "dd MMM yyyy");
};

export const toSentenceCase = (value: string) =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

export const clampPercent = (value: number) => {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
};
