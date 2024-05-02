export type StepInterval = {
  threshold: number; // The threshold in seconds
  interval: number; // The interval in milliseconds
};

export function getSteppedIntervalTime(
  diffInSeconds: number,
  steps: StepInterval[],
): number {
  // Create a copy of steps and sort it in descending order
  const sortedSteps = [...steps].sort((a, b) => b.threshold - a.threshold);

  // If diffInSeconds is greater than the highest threshold, return the interval of the highest threshold
  if (diffInSeconds > sortedSteps[0].threshold) {
    return sortedSteps[0].interval;
  }

  // Find the appropriate interval
  for (const step of sortedSteps) {
    if (diffInSeconds >= step.threshold) {
      return step.interval;
    }
  }

  // If no step matches, return the smallest interval
  return sortedSteps[sortedSteps.length - 1].interval;
}
