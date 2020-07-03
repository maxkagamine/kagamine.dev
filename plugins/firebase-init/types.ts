export interface InitOptions {
  /**
   * The firebase config object.
   */
  firebaseConfig: object;

  /**
   * Analytics id. Using Google Analytics directly rather than via Firebase as
   * the latter doesn't currently support Enhanced Measurement, which tracks
   * client-side route changes for us automatically.
   */
  measurementId: string;

  /**
   * Primary domain to redirect to if neither this nor localhost. This is to
   * prevent the site from being viewed from firebase's default domains.
   */
  domain: string;

  /**
   * Public VAPID key for notifications.
   */
  vapidKey: string;
}
