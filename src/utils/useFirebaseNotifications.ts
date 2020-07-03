import firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ManageNotificationsData } from '../../functions/src/types';

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

function manageNotifications(data: ManageNotificationsData) {
  return firebase.functions().httpsCallable('manageNotifications')(data);
}

// NOTE: This implementation only supports one usage (for multiple components,
// a context provider or observable could be used to keep their states in sync)
export function useFirebaseNotifications(topic: string): [NotificationsState, SubscribeFunction] {
  // Define local storage key to keep track of whether user is subscribed and
  // get their token without having to hit the server
  const TOKEN_KEY = `notifications.${topic}.token`;

  // Current notifications state for topic
  let [state, setState] = useState(NotificationsState.Unsubscribed);

  // Initial state needs to be same as SSR as it won't rerender if not
  useEffect(() => {
    if (!('Notification' in window)) {
      setState(NotificationsState.NotSupported);
    } else if (Notification.permission == 'denied') {
      setState(NotificationsState.PermissionDenied);
    } else if (localStorage[TOKEN_KEY]) {
      setState(NotificationsState.Subscribed);
    } else {
      setState(NotificationsState.Unsubscribed);
    }
  }, [setState, TOKEN_KEY]);

  const intl = useIntl();

  // Function to (un)subscribe to/from topic
  const subscribeFunction: SubscribeFunction = async (subscribe: boolean = true) => {
    try {
      if (subscribe) {
        // Optimistically show subscribed state
        setState(NotificationsState.Subscribed);

        // Subscribe to topic
        let token = await firebase.messaging().getToken();
        await manageNotifications({ token, topic, subscribe });
        localStorage[TOKEN_KEY] = token;
      } else {
        // Optimistically show unsubscribed state
        setState(NotificationsState.Unsubscribed);

        // Unsubscribe from topic
        await manageNotifications({ token: localStorage[TOKEN_KEY], topic, subscribe });
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
