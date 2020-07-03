///<reference lib="webworker" />
import { MessagePayload } from '@firebase/messaging/dist/interfaces/message-payload';

/*
  Firebase by default treats push messages in a generic sort of way, only
  showing a notification if the site isn't open (and if it's open when the
  notification is clicked, focusing the tab to send the message to it, even if
  the path is different), otherwise sending it to all open tabs. This is more
  suitable for proper PWAs.

  Since we're using push notifications as a sort of modern substitute for an RSS
  reader rather than anything app-like, we'll simply show the notification and
  open the link in a new tab when clicked.

  These functions are lazily toString()'d into the worker js in onPostBuild in
  order to get type checking etc. without having to do a separate build. Caveat
  is they have to be self-contained. (See the TODO in onPostBuild.)
*/

declare const self: ServiceWorkerGlobalScope;

// https://github.com/firebase/firebase-js-sdk/blob/firebase%407.15.5/packages/messaging/src/controllers/sw-controller.ts#L153
export function onPush(event: PushEvent) {
  event.waitUntil((async () => {
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
    let title = payload.notification.title;
    await self.registration.showNotification(title, payload.notification);
  })());
}

// https://github.com/firebase/firebase-js-sdk/blob/firebase%407.15.5/packages/messaging/src/controllers/sw-controller.ts#L190
export function onNotificationClick(event: NotificationEvent) {
  event.waitUntil((async () => {
    // Get payload (note that because we didn't set FCM_MSG in onPush, the
    // default onNotificationClick handler will ignore this event)
    let payload: MessagePayload = event.notification?.data;
    if (!payload) {
      return;
    }

    // Close the notification
    event.stopImmediatePropagation();
    event.notification.close();

    // Open the link in a new tab
    let link = payload.fcmOptions?.link ?? payload.notification?.click_action ?? self.location.origin;
    await self.clients.openWindow(link);
  })());
}
