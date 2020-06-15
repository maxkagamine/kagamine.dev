import { WindowLocation } from '@reach/router';
import { PageProps } from 'gatsby';

export interface LocalizedPageContext {
  /**
   * All available translations for this page as a map of locale to path.
   */
  translations: Record<string, string>;
}

export interface LocalizedPageProps<
  DataType = object,
  PageContextType extends LocalizedPageContext = LocalizedPageContext,
  LocationState = WindowLocation['state']
> extends PageProps<DataType, PageContextType, LocationState> {}
