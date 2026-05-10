import { INotificationChannel, INotificationService } from "../core/interfaces";

export class NotificationService implements INotificationService {
  private readonly channels: INotificationChannel[] = [];

  addChannel(channel: INotificationChannel): void {
    this.channels.push(channel);
  }

  notify(message: string): void {
    for (const channel of this.channels) {
      channel.send(message);
    }
  }
}
