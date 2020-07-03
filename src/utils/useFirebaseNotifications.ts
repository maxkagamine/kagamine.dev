import firebase from 'firebase/app';
import 'firebase/messaging';
import { useState } from 'react';
import { useIntl } from 'react-intl';

const FIREBASE_ERROR_PERMISSION_BLOCKED = 'messaging/permission-blocked';

export enum NotificationsState {
  Unsubscribed,
  Subscribed,
  PermissionDenied,
  NotSupported,
  Error
}

export interface SubscribeFunction {
  (subscribe?: boolean): Promise<void>;
}

// NOTE: This implementation only supports one usage (for multiple components,
// a context provider or observable could be used to keep their states in sync)
export function useFirebaseNotifications(topic: string): [NotificationsState, SubscribeFunction] {
  // Define local storage key to keep track of whether user is subscribed and
  // get their token without having to hit the server
  const TOKEN_KEY = `notifications.${topic}.token`;

  // Current notifications state for topic
  let [state, setState] = useState<NotificationsState>(() => {
    if (!('Notification' in window)) {
      return NotificationsState.NotSupported;
    }
    if (Notification.permission == 'denied') {
      return NotificationsState.PermissionDenied;
    }
    if (localStorage[TOKEN_KEY]) {
      return NotificationsState.Subscribed;
    }
    return NotificationsState.Unsubscribed;
  });

  const intl = useIntl();

  // Function to (un)subscribe to/from topic
  const subscribeFunction: SubscribeFunction = async (subscribe: boolean = true) => {
    try {
      if (subscribe) {
        // Optimistically show subscribed state
        setState(NotificationsState.Subscribed);

        // Subscribe to topic
        let token = await firebase.messaging().getToken();
        console.log('Subscribe:', token); // TODO: Send token to cloud function to subscribe to topic

        localStorage[TOKEN_KEY] = token;
      } else {
        // Optimistically show unsubscribed state
        setState(NotificationsState.Unsubscribed);

        // Unsubscribe from topic
        console.log('Unsubscribe:', localStorage[TOKEN_KEY]); // TODO: Send token to cloud function to unsubscribe from topic

        delete localStorage[TOKEN_KEY];
      }
    } catch (e) {
      if (e.code == FIREBASE_ERROR_PERMISSION_BLOCKED) {
        alert(intl.formatMessage({ id: 'notificationsDenied' }));
        setState(NotificationsState.PermissionDenied);
      } else {
        console.error(e);
        alert(intl.formatMessage({ id: 'notificationsError' }));
        setState(NotificationsState.Error);
      }
    }
  };

  return [state, subscribeFunction];
}
