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
   * For blog posts, the slug for use in the page query.
   */
  slug?: string;

  /**
   * For blog posts, the slug of the previous (older) post.
   */
  previous?: string;

  /**
   * For blog posts, the slug of the next (newer) post.
   */
  next?: string;

  /**
   * The locale for use in page queries (use `intl.locale` otherwise). Undefined
   * in 404 page.
   */
  locale?: string;
}

export interface InternalLocalizedPageContext extends LocalizedPageContext {
  locales?: string[]; // Used only for 404 page
  messages: Messages | Record<string, Messages>; // Latter type only for 404 page
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
