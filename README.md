<div align="center">
  <img src="./assets/rebound-text.png" alt="Rebound Logo" width="150" />
</div>

# 🏀 Rebound TS

> A lightweight, robust, and type-safe retry decorator for TypeScript and NestJS.

**Rebound** (or `rebound-ts`) allows you to automatically retry failing operations with configurable strategies like exponential backoff and error filtering. It acts as a resilient wrapper around your methods, perfect for handling unstable external APIs or database connections.

## 📦 Installation

```bash
npm install rebound-ts
# or
yarn add rebound-ts
```

## 🚀 Usage

### Basic Example (NestJS Service)

Just add the `@Rebound` decorator to any class method.

```typescript
import { Injectable } from "@nestjs/common";
import { Rebound } from "rebound-ts";
import axios from "axios";

@Injectable()
export class ExternalApiService {
  // Will try to run the code 3 times.
  // Default: 3 attempts, 1000ms delay.
  @Rebound({
    attempts: 3,
    delay: 1000,
    backoffFactor: 2,
  })
  async fetchData() {
    console.log("Calling unstable API...");
    // If this throws an error, Rebound catches it!
    return axios.get("https://api.example.com/data");
  }
}
```

### Advanced: Filtering Errors

You often want to retry only on specific errors (e.g., Network Timeout) but fail immediately on others (e.g., Bad Request).

```typescript
import { Rebound } from "rebound-ts";
import axios from "axios";

class PaymentProcessor {
  @Rebound({
    attempts: 5,
    // Condition: Only retry if the error status is 500 or greater
    shouldRetry: (err: any) => {
      if (axios.isAxiosError(err) && err.response) {
        return err.response.status >= 500;
      }
      return true; // Retry on generic network errors
    },
    // Callback: Log warnings on every failure
    onRetry: (err, attempt) => {
      console.warn(`Attempt ${attempt} failed. Retrying...`);
    },
  })
  async processTransaction(id: string) {
    // ... complex logic
  }
}
```

## ⚙️ Configuration Options

| Option          | Type       | Default      | Description                                                |
| :-------------- | :--------- | :----------- | :--------------------------------------------------------- |
| `attempts`      | `number`   | `3`          | Maximum number of attempts.                                |
| `delay`         | `number`   | `1000`       | Initial wait time in milliseconds before the first retry.  |
| `backoffFactor` | `number`   | `1`          | Multiplier for the delay (Exponential Backoff).            |
| `shouldRetry`   | `function` | `() => true` | Predicate function to filter which errors trigger a retry. |
| `onRetry`       | `function` | `undefined`  | Callback hook executed on every retry attempt.             |

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)

<div align="center">
  <img src="./assets/rebound-logo.png" alt="Rebound Logo" width="50" />
</div>
