// Generated by CodiumAI

import { StepInterval, getSteppedIntervalTime } from './getSteppedIntervalTime';

describe('getSteppedIntervalTime', () => {
  const steps: StepInterval[] = [
    { threshold: 5, interval: 300 },
    { threshold: 3, interval: 200 },
    { threshold: 1, interval: 100 },
  ];
  // Returns the correct interval when diffInSeconds is greater than the highest threshold in steps, and steps are sorted in descending order
  it('should return the correct interval when diffInSeconds is greater than the highest threshold', () => {
    const diffInSeconds = 10;

    const result = getSteppedIntervalTime(diffInSeconds, steps);

    expect(result).toBe(300);
  });

  // Returns the correct interval when diffInSeconds is equal to a threshold in steps, and steps are sorted in descending order
  it('should return the correct interval when diffInSeconds is equal to a threshold', () => {
    const diffInSeconds = 3;

    const result = getSteppedIntervalTime(diffInSeconds, steps);

    expect(result).toBe(200);
  });

  // Returns the correct interval when diffInSeconds is less than the lowest threshold in steps, and steps are sorted in descending order
  it('should return the correct interval when diffInSeconds is less than the lowest threshold', () => {
    const diffInSeconds = 0;

    const result = getSteppedIntervalTime(diffInSeconds, steps);

    expect(result).toBe(100);
  });

  // Returns the correct interval when diffInSeconds is equal to the highest threshold in steps, and steps are sorted in descending order
  it('should return the correct interval when diffInSeconds is equal to the highest threshold', () => {
    const diffInSeconds = 5;
    const result = getSteppedIntervalTime(diffInSeconds, steps);

    expect(result).toBe(300);
  });

  // Returns the correct interval when diffInSeconds is equal to the lowest threshold in steps, and steps are sorted in descending order
  it('should return the correct interval when diffInSeconds is equal to the lowest threshold', () => {
    const diffInSeconds = 1;

    const result = getSteppedIntervalTime(diffInSeconds, steps);

    expect(result).toBe(100);
  });

  // Returns the smallest interval in steps when diffInSeconds is negative
  it('should return the smallest interval when diffInSeconds is negative', () => {
    const diffInSeconds = -10;
    const result = getSteppedIntervalTime(diffInSeconds, steps);
    expect(result).toBe(100);
  });

  // Returns the smallest interval when steps are not in descending order
  it('should return the smallest interval when steps are not in descending order', () => {
    const diffInSeconds = 10;
    const steps: StepInterval[] = [
      { threshold: 1, interval: 100 },
      { threshold: 5, interval: 300 },
      { threshold: 3, interval: 200 },
    ];

    const result = getSteppedIntervalTime(diffInSeconds, steps);

    expect(result).toBe(300);
  });
});
