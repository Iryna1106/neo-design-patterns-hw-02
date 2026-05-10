import { ILogger } from "../core/interfaces";

export class Logger implements ILogger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}
