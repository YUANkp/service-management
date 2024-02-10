export const dateFormat = (timestamp: number) => {
  const date = new Date();
  date.setTime(timestamp);

  return date.toLocaleString();
};
