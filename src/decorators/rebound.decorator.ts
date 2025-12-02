import { ReboundOptions } from "../interfaces/rebound-options.contract";
import { sleep } from "../utils/sleep.util";

export function Rebound(options: ReboundOptions) {
  const maxAttempts = options.attempts || 3;
  const initialDelay = options.delay || 1000;
  const backoffFactor = options.backoffFactor || 1;
  const shouldRetry = options.shouldRetry || (() => true);

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let attempt = 1;
      let currentDelay = initialDelay;

      while (true) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error: unknown) {
          if (attempt > maxAttempts || !shouldRetry(error)) {
            console.error(
              `Method ${propertyKey} failed after ${maxAttempts} attempts.`
            );

            throw error;
          }

          if (options.onRetry) {
            options.onRetry(error, attempt);
          }

          await sleep(currentDelay);

          attempt++;
          currentDelay *= backoffFactor;
        }
      }
    };

    return descriptor;
  };
}
