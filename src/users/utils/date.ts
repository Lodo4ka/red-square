export const toMilliseconds = (seconds: number) => seconds * 1000;

export const addSeconds = (date: Date, seconds: number): Date =>
  new Date(date.getTime() + toMilliseconds(seconds));
