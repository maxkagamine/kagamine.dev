export interface BasicMetadata {
  /**
   * The page title.
   */
  title?: string;

  /**
   * The page image. Sets the Twitter card to summary_large_image Twitter card
   * if provided.
   */
  image?: string;

  /**
   * The page description.
   */
  description?: string;
}

export interface WebsiteMetadata extends BasicMetadata {
  type: 'website';
}

export interface ArticleMetadata extends BasicMetadata {
  type: 'article';

  /**
   * The data the article was published as an ISO 8601 string.
   */
  datePublished: string;

  /**
   * The data the article was updated as an ISO 8601 string.
   */
  dateUpdated?: string;
}

export type PageMetadata = WebsiteMetadata | ArticleMetadata;
