import { ILogger, INotificationChannel } from "../core/interfaces";

export class PushNotification implements INotificationChannel {
  constructor(
    private readonly logger: ILogger,
    private readonly deviceToken: string
  ) {}

  send(message: string): void {
    this.logger.log(`Sending PUSH to ${this.deviceToken}`);
    console.log(`Push sent to ${this.deviceToken}: ${message}`);
  }
}
