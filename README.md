# Домашнє завдання до Теми Принципи проєктування SOLID

У реальних проєктах погана архітектура часто не видно одразу — але з часом вона ускладнює підтримку, тестування та розвиток системи. Це завдання — можливість попрактикуватися у виявленні таких недоліків і вдосконаленні структури проєкту за принципами SOLID. Ви побачите, як через правильні абстракції та інтерфейси код стає зрозумілішим, гнучкішим і готовим до змін.

### Опис завдання

Вам надано приклад простої системи повідомлень, у якій навмисно реалізовано архітектуру, що порушує принципи проєктування SOLID. Ваше завдання — провести архітектурний рефакторинг, дотримуючись принципів SOLID, та реалізувати систему повідомлень, яка може бути масштабовано, легко підтримуваною та модульною.

### Очікуваний результат

- Усі канали повідомлень `Email`, `SMS`, `Push` мають бути окремими сервісами, які реалізують спільний інтерфейс.
- Клас `NotificationService` не повинен знати про конкретні реалізації каналів.
- `Logger` має бути переданим як залежність через інтерфейс.
- Клас `User` більше не викликає логіку повідомлень.
- У `main.ts` повинна бути наочно продемонстрована взаємодія з системою через абстракції.

---

## Виконаний рефакторинг

### Структура проєкту

```
src/
├── core/
│   └── interfaces.ts        # ILogger, INotificationChannel, INotificationService
├── models/
│   └── User.ts              # data-клас користувача
├── services/
│   ├── Logger.ts            # реалізація ILogger
│   ├── EmailNotification.ts # канал Email (INotificationChannel)
│   ├── SMSNotification.ts   # канал SMS   (INotificationChannel)
│   ├── PushNotification.ts  # канал Push  (INotificationChannel)
│   └── NotificationService.ts # агрегатор каналів
└── main.ts                  # composition root
```

### Як виправлено порушення SOLID

| Принцип | Що було | Що стало |
| --- | --- | --- |
| **SRP** | `User` зберігав дані *і* надсилав повідомлення; `NotificationService` поєднував надсилання з логуванням. | `User` — лише дані. `Logger` — лише логування. Кожен канал — лише власний транспорт. |
| **OCP** | Додавання нового каналу (наприклад, Telegram) вимагало правок у `NotificationService`. | `NotificationService` оперує списком `INotificationChannel`. Новий канал — це новий клас, що реалізує інтерфейс; жоден існуючий клас не змінюється. |
| **LSP** | Канали не мали спільного типу — взаємозамінність неможлива. | Усі канали реалізують `INotificationChannel` із єдиним методом `send(message)` і вільно підставляються один замість одного. |
| **ISP** | Один «жирний» клас з `sendEmail`/`sendSMS`/`sendPush`. | Кожен канал має тільки один метод `send`, який потрібен його клієнту. |
| **DIP** | `new NotificationService()` усередині `User`, `new Logger()` усередині сервісу. | Залежності інжектуються через конструктор у вигляді інтерфейсів (`ILogger`, `INotificationChannel`); конкретні класи збираються лише в `main.ts`. |

### Ключові зміни

- **`core/interfaces.ts`** — додано `ILogger`, `INotificationChannel` (`send(message)`), `INotificationService` (`addChannel`, `notify`). З `INotificationService` прибрані методи `sendEmail`/`sendSMS`/`sendPush`, бо вони прив’язували агрегатор до конкретних каналів.
- **`services/EmailNotification.ts`, `SMSNotification.ts`, `PushNotification.ts`** — нові класи, кожен реалізує `INotificationChannel` і отримує `ILogger` та адресу отримувача через конструктор.
- **`services/NotificationService.ts`** — тримає `INotificationChannel[]`, надає `addChannel()` і `notify()`. Не імпортує жодної конкретної реалізації каналу.
- **`services/Logger.ts`** — реалізує `ILogger`.
- **`models/User.ts`** — чистий data-клас без логіки повідомлень.
- **`main.ts`** — створює `Logger`, реєструє канали в `NotificationService` і викликає `notify()`; уся взаємодія йде через інтерфейси.

### Як запустити

```bash
npx tsc
node dist/main.js
```

Очікуваний вивід:

```
[LOG]: Sending EMAIL to example@email.com
Email sent to example@email.com: Ваш платіж оброблено успішно!
[LOG]: Sending SMS to +380123456789
SMS sent to +380123456789: Ваш платіж оброблено успішно!
[LOG]: Sending PUSH to device-token-abc
Push sent to device-token-abc: Ваш платіж оброблено успішно!
```
