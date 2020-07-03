import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/messaging';
import { InitOptions } from './types';

export const onClientEntry = (_: never, pluginOptions: InitOptions) => {
  if (typeof window == 'undefined') {
    return;
  }

  firebase.initializeApp(pluginOptions.firebaseConfig);
  firebase.messaging().usePublicVapidKey(pluginOptions.vapidKey);

  // See note in types.ts for why I'm not using firebase.analytics() here.
};
