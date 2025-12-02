/**
 * Pauses execution for a specified amount of time.
 * @param ms Duration in milliseconds to wait.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
