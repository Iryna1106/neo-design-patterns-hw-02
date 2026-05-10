export interface ILogger {
  log(message: string): void;
}

export interface INotificationChannel {
  send(message: string): void;
}

export interface INotificationService {
  addChannel(channel: INotificationChannel): void;
  notify(message: string): void;
}
