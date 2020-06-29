import * as functions from 'firebase-functions';

const LOCALES = ['en', 'ja'];

export const root = functions.https.onRequest((req, res) => {
  let locale = req.acceptsLanguages(LOCALES) || LOCALES[0];
  res.set('Cache-Control', 'public, max-age=3600');
  res.set('Vary', 'Accept-Language');
  res.redirect(`/${locale}/`);
});
