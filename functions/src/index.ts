import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ManageNotificationsData } from './types';

const LOCALES = ['en', 'ja'];

admin.initializeApp();

/**
 * Function handling requests to /, redirecting based on Accept-Language.
 */
export const root = functions.https.onRequest((req, res) => {
  let locale = req.acceptsLanguages(LOCALES) || LOCALES[0];
  res.set('Cache-Control', 'public, max-age=604800');
  res.set('Vary', 'Accept-Language');
  res.redirect(`/${locale}/`);
});

/**
 * Enables or disables notifications for a user.
 */
export const manageNotifications = functions.https.onCall(async ({ token, topic, subscribe }: ManageNotificationsData) => {
  // Topic is one of the site locales and receives notifications for new posts
  // in that locale
  if (!LOCALES.includes(topic)) {
    throw new Error(`Unknown topic: ${topic}`);
  }

  if (subscribe) {
    await admin.messaging().subscribeToTopic(token, topic);
  } else {
    await admin.messaging().unsubscribeFromTopic(token, topic);
  }
});
