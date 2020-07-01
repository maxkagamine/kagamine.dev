export interface InitOptions {
  /**
   * The firebase config object.
   */
  firebase: object;

  /**
   * Analytics config. Using Google Analytics directly rather than via Firebase
   * as the latter doesn't currently support Enhanced Measurement, which tracks
   * client-side route changes for us automatically.
   */
  analytics: {
    measurementId: string;
  };

  /**
   * Primary domain to redirect to if neither this nor localhost. This is to
   * prevent the site from being viewed from firebase's default domains.
   */
  domain: string;
}
