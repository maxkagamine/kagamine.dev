///<reference lib="webworker" />
import type { MessagePayload } from '@firebase/messaging/dist/interfaces/message-payload';
import profileSrc from '../images/profile.png';
import { toAbsoluteUrl } from '../utils/toAbsoluteUrl';
declare const self: ServiceWorkerGlobalScope;

/*
  Firebase by default treats push messages in a generic sort of way, only
  showing a notification if the site isn't open (and if it's open when the
  notification is clicked, focusing the tab to send the message to it, even if
  the path is different), otherwise sending it to all open tabs. This is more
  suitable for proper PWAs.

  Since we're using push notifications as a sort of modern substitute for an RSS
  reader, we'll simply show the notification and open the link in a new tab when
  clicked. Firebase SDK isn't needed in this case.
*/

const SITE_URL = 'https://kagamine.dev';

self.addEventListener('push', (e: PushEvent) => e.waitUntil(onPush(e)));
self.addEventListener('notificationclick', (e: NotificationEvent) => e.waitUntil(onNotificationClick(e)));

async function onPush(event: PushEvent) {
  // Get message payload
  let payload: MessagePayload;
  try {
    payload = event.data?.json();
  } catch {
    return;
  }

  if (typeof payload?.notification != 'object') {
    return;
  }

  // Show notification
  let { title, ...rest } = payload.notification;
  let notificationOptions: NotificationOptions = {
    icon: toAbsoluteUrl(SITE_URL, profileSrc),
    silent: true, // Not that important, and also may come at any time of day
    ...rest,
    data: {
      ...(payload.data as any),
      ...rest.data
    }
  };
  await self.registration.showNotification(title, notificationOptions);
}

async function onNotificationClick(event: NotificationEvent) {
  // Close the notification
  event.stopImmediatePropagation();
  event.notification.close();

  // Get url (there's no standard property for onClick; we could use fcmOptions
  // like firebase, but since we're DIY-ing this part, we can just use data)
  let url = event.notification.data?.url ?? self.location.origin;

  // Open the link in a new tab
  await self.clients.openWindow(url);
}
