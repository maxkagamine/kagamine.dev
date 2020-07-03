import { promises as fs } from 'fs';
import { ParentSpanPluginArgs } from 'gatsby';
import { InitOptions } from './types';

// https://firebase.google.com/docs/cloud-messaging/js/receive
export const onPostBootstrap = async (_: ParentSpanPluginArgs, pluginOptions: InitOptions) => {
  await fs.writeFile('public/firebase-messaging-sw.js', `
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');

firebase.initializeApp(${JSON.stringify(pluginOptions.firebaseConfig, null, 2)});

firebase.messaging();
`);
};
