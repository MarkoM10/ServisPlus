import * as Notifications from "expo-notifications";

export const BASE_IP = "192.168.8.130";

export const scheduleLocalReminder = async (title: string, dueDate: string) => {
  enum SchedulableTriggerInputTypes {
    TIME_INTERVAL = "timeInterval",
    DAILY = "daily",
    DATE = "date",
  }

  const target = new Date(dueDate);
  target.setHours(9, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if ([10, 5, 0].includes(diffInDays)) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔧 Servisni podsetnik",
        body:
          diffInDays === 0
            ? `Danas je vreme za: ${title}`
            : `Za ${diffInDays} dana treba da odradiš: ${title}`,
        sound: "default",
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: new Date(Date.now() + 2000),
      },
    });
  } else {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔧 Servisni podsetnik",
        body: `Podsetnik za: ${title}`,
        sound: "default",
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: target,
      },
    });
  }
};
