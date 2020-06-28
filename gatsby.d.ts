import { WindowLocation } from '@reach/router';
import { PageProps } from 'gatsby';

declare var __PATH_PREFIX__: string;

declare module '*.png' {
  const content: string;
  export default content;
}

// Type declarations for localized-blog plugin, declared here due to it
// currently being difficult to use TS in a local plugin.
declare global {
  interface LocalizedPageContext {
    /**
     * All available translations for the page as a map of locale to site-relative
     * url, including the current locale.
     */
    alternateUrls: Record<string, string>;
  }

  interface LocalizedPageProps<
    DataType = object,
    PageContextType extends LocalizedPageContext = LocalizedPageContext,
    LocationState = WindowLocation['state']
  > extends PageProps<DataType, PageContextType, LocationState> {}
}
