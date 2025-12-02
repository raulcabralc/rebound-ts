export interface ReboundOptions {
  /**
   * The maximum number of attempts to execute the method.
   * e.g., 3 means: 1 initial attempt + 2 retries.
   * @default 3 (3 attempts)
   */
  attempts?: number;

  /**
   * Initial delay in milliseconds before the first retry.
   * @default 1000 (1 second)
   */
  delay?: number;

  /**
   * The multiplier for the delay (Exponential Backoff).
   * If delay is 1000 and factor is 2, the sequence will be: 1s, 2s, 4s...
   * @default 1
   */
  backoffFactor?: number;

  /**
   * Optional callback triggered on every retry attempt.
   * Useful for logging or metrics.
   */
  onRetry?: (error: unknown, attempt: number) => void;

  /**
   * Condition to determine if a retry should occur based on the error.
   * If it returns false, the retry loop stops immediately and throws the error.
   * e.g., (err: any) => err.status === 503 (will only retry if the error status is 503)
   * @param error The exception thrown by the method.
   */
  shouldRetry?: (error: unknown) => boolean;
}
