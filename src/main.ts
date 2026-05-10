import { ILogger, INotificationService } from "./core/interfaces";
import { User } from "./models/User";
import { Logger } from "./services/Logger";
import { NotificationService } from "./services/NotificationService";
import { EmailNotification } from "./services/EmailNotification";
import { SMSNotification } from "./services/SMSNotification";
import { PushNotification } from "./services/PushNotification";

const user = new User(
  "example@email.com",
  "+380123456789",
  "device-token-abc"
);

const logger: ILogger = new Logger();

const notificationService: INotificationService = new NotificationService();
notificationService.addChannel(new EmailNotification(logger, user.email));
notificationService.addChannel(new SMSNotification(logger, user.phone));
notificationService.addChannel(new PushNotification(logger, user.deviceToken));

notificationService.notify("Ваш платіж оброблено успішно!");
