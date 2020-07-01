import firebase from 'firebase/app';
import { InitOptions } from './types';

export const onClientEntry = (_: never, pluginOptions: InitOptions) => {
  firebase.initializeApp(pluginOptions.firebase);

  // See note in types.ts for why I'm not using firebase.analytics() here.
};
