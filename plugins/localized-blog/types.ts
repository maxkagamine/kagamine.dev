import { WindowLocation } from '@reach/router';
import { PageProps, PluginOptions } from 'gatsby';
import { MessageFormatElement } from 'intl-messageformat-parser';

export interface LocalizedBlogOptions extends PluginOptions {
  /**
   * The site locales.
   */
  locales: string[];

  /**
   * Path to a directory containing {locale}.json files.
   */
  messages: string;

  /**
   * Path to the blog post template component.
   */
  blogPostTemplate: string;
}

export type Messages = Record<string, MessageFormatElement[]>;


export interface LocalizedPageContext {
  /**
   * All available translations for the page as a map of locale to site-relative
   * url, including the current locale.
   */
  alternateUrls: Record<string, string>;

  /**
   * The slug for use in the blog post template's page query.
   */
  slug?: string;
}

export interface InternalLocalizedPageContext extends LocalizedPageContext {
  locale: string;
  messages: Messages;
}

export interface LocalizedPageProps<
  DataType = object,
  PageContextType extends LocalizedPageContext = LocalizedPageContext,
  LocationState = WindowLocation['state']
> extends PageProps<DataType, PageContextType, LocationState> {}

export interface MarkdownRemarkNode {
  fields: {
    slug: string;
    locale: string;
    dirname: string;
  }
  frontmatter: {
    slug: string;
  }
}

export interface AllMarkdownRemarkQuery {
  data?: {
    allMarkdownRemark: {
      edges: Array<{
        node: MarkdownRemarkNode
      }>
    }
  }
}
