import { WindowLocation } from '@reach/router';
import { PageProps } from 'gatsby';

export interface LocalizedPageContext {
  /**
   * All available translations for the page as a map of locale to site-relative
   * url, including the current locale.
   */
  alternateUrls: Record<string, string>;
}

export interface LocalizedPageProps<
  DataType = object,
  PageContextType extends LocalizedPageContext = LocalizedPageContext,
  LocationState = WindowLocation['state']
> extends PageProps<DataType, PageContextType, LocationState> {}
