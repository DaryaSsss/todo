import dayjs from 'dayjs';

export const isDayExpired = date =>
  dayjs().date() === dayjs(date).date() ? false : dayjs().isAfter(dayjs(date));
