import { promises as fs } from 'fs';
import { BuildArgs } from 'gatsby';
import { onNotificationClick, onPush } from './serviceWorker';
import { InitOptions } from './types';

// TODO: A (much) better way to build the service worker would be to add an
// additional entry point to the webpack config and use the define plugin to
// pass in the firebase config

// https://firebase.google.com/docs/cloud-messaging/js/receive
export const onPostBuild = async (_: BuildArgs, pluginOptions: InitOptions) => {
  await fs.writeFile('public/firebase-messaging-sw.js', `
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');

firebase.initializeApp(${JSON.stringify(pluginOptions.firebaseConfig, null, 2)});

let messaging = firebase.messaging();

// Always show notification and open in new tab when clicked
messaging.setBackgroundMessageHandler(() => {});
self.addEventListener('push', ${onPush.toString()});
self.addEventListener('notificationclick', ${onNotificationClick.toString()});
`);
};
