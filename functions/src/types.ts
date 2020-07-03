export interface ManageNotificationsData {
  /**
   * The user's token.
   */
  token: string;

  /**
   * The topic to/from which to (un)subscribe.
   */
  topic: string;

  /**
   * Whether to subscribe or unsubscribe.
   */
  subscribe: boolean;
}
