import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import fs from 'fs-extra';
import Parser from 'rss-parser';
import { ManageNotificationsData } from './types';

const LOCALES = ['en', 'ja'];

const NOTIFICATION_BODY_MAX_LENGTH = 80;
const NOTIFICATION_BODY_MAX_LENGTH_JA = 40;

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

/**
 * Checks the site's rss feed and sends a notification for the latest entry if
 * newer than the last that was seen.
 */
export const sendNotifications = functions.https.onRequest(async (req, res) => {
  // Read each locale's rss feed, copied into lib by predeploy
  let parser = new Parser();
  for (let locale of LOCALES) {
    let xml = await fs.readFile(`${__dirname}/public/${locale}/feed.xml`, 'utf8');
    let feed = await parser.parseString(xml);

    // Get last seen post's timestamp
    let doc = admin.firestore().collection('notifications').doc(locale);
    let lastSeen: number = (await doc.get()).data()?.lastSeen ?? 0;

    // Check if latest entry is newer
    let latest = feed.items?.[0];
    let timestamp = latest?.pubDate ? new Date(latest.pubDate).getTime() : 0;
    if (timestamp > lastSeen && latest?.title && latest?.link) {
      // Update last seen
      await doc.set({ lastSeen: timestamp });

      // Trim description
      let body = latest.contentSnippet || undefined;
      let maxLength = locale == 'ja' ?
        NOTIFICATION_BODY_MAX_LENGTH_JA : NOTIFICATION_BODY_MAX_LENGTH;
      if (body && body.length > maxLength) {
        body = body.substr(0, maxLength - 1) + '…';
      }

      // Send notification
      await admin.messaging().send({
        notification: {
          title: latest.title,
          body
        },
        data: {
          url: latest.link
        },
        topic: locale
      });
    }
  }

  // Whoop
  res.status(200).end();
});
