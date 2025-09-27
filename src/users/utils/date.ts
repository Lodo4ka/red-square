export const toMilliseconds = (seconds: number) => seconds * 1000;

export const addSeconds = (date: Date, seconds: number): Date => {
  const newDate = new Date(date);
  newDate.setSeconds(newDate.getSeconds() + seconds);
  return newDate;
};
