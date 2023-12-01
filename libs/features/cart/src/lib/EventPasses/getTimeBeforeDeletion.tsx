export function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [
    hrs.toString().padStart(2, '0'),
    mins.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':');
}

interface OrderProps {
  createdAt: string;
  timeBeforeDelete?: number;
}

export function getTimeBeforeDeletion({
  createdAt,
  timeBeforeDelete = 14400,
}: OrderProps): number {
  const orderCreationTime = new Date(createdAt).getTime() / 1000;
  const deletionTime = orderCreationTime + timeBeforeDelete;
  const currentTime = Math.floor(Date.now() / 1000);
  const timeBeforeDeletion = deletionTime - currentTime;
  return timeBeforeDeletion > 0 ? timeBeforeDeletion : 0;
}
