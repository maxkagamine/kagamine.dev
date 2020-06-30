import firebase from 'firebase/app';

export const onClientEntry = (_: never, firebaseConfig: object) => {
  firebase.initializeApp(firebaseConfig);

  if (process.env.NODE_ENV == 'production' && document.location.hostname != 'localhost') {
    import('firebase/analytics').then(() => {
      // Client-side routing is tracked when Enhanced Measurement is enabled:
      // https://support.google.com/analytics/answer/9216061
      firebase.analytics();
    });
  }
};
