import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import profileSrc from '../../images/profile.png';
import { toAbsoluteUrl } from '../../utils/toAbsoluteUrl';
import { PageMetadata } from './types';

interface MetadataProps {
  /**
   * The page's metadata.
   */
  metadata?: PageMetadata;

  /**
   * The site url.
   */
  siteUrl: string;

  /**
   * All available translations for the page as a map of locale to site-relative
   * url, including the current locale.
   */
  alternateUrls: Record<string, string>;

  /**
   * Whether this is the homepage.
   */
  isHome: boolean;
}

export function Metadata(props: MetadataProps) {
  const { metadata, siteUrl, alternateUrls, isHome } = props;
  const intl = useIntl();

  let name = intl.formatMessage({ id: 'name' });
  let title = metadata?.title ?? name;
  let canonicalUrl = toAbsoluteUrl(siteUrl, alternateUrls[intl.locale]);
  let profileImageUrl = toAbsoluteUrl(siteUrl, profileSrc);
  let imageUrl = metadata?.image == null ? profileImageUrl : toAbsoluteUrl(siteUrl, metadata.image);

  let selfSchema = {
    '@type': 'Person',
    name,
    url: siteUrl,
    image: profileImageUrl,
    jobTitle: intl.formatMessage({ id: 'jobTitle' }),
    spouse: {
      // Now the question is, will this show up in google search...? (*´ω｀*)
      '@type': 'Person',
      name: intl.formatMessage({ id: 'kagamineRin' }),
      image: 'https://vocadb.net/Artist/Picture/43192',
      sameAs: 'https://en.wikipedia.org/wiki/Kagamine_Rin/Len'
    },
    sameAs: [
      'https://twitter.com/maxkagamine',
      'https://github.com/maxkagamine'
    ]
  };

  let structuredData =
    isHome ? selfSchema :
    metadata?.type == 'article' ? {
      '@type': 'Article',
      headline: title,
      datePublished: metadata.datePublished,
      dateModified: metadata.dateUpdated,
      image: imageUrl,
      inLanguage: intl.locale,
      description: metadata.description,
      author: selfSchema,
      publisher: selfSchema,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      }
    } :
    undefined;

  return <>
    <Helmet htmlAttributes={{ lang: intl.locale }}>
      {/* Standard tags */}
      <title>{title}</title>
      {metadata?.description && (
        <meta name='description' content={metadata.description} />
      )}
      {/* Canonical & alternate urls */}
      <link rel='canonical' href={canonicalUrl} />
      {Object.entries(alternateUrls).map(([locale, url]) => url &&
        <link rel='alternate' href={toAbsoluteUrl(siteUrl, url)} hrefLang={locale} key={locale} />)}
      {/* Open Graph */}
      <meta property='og:type' content={metadata?.type ?? 'website'} />
      <meta property='og:title' content={title} />
      <meta property='og:image' content={imageUrl} />
      <meta property='og:url' content={canonicalUrl} />
      <meta property='og:site_name' content={name} />
      {metadata?.description && (
        <meta property='og:description' content={metadata.description} />
      )}
      {/* Twitter */}
      <link rel='me' href='https://twitter.com/maxkagamine' />
      <meta name='twitter:card' content={metadata?.image == null ? 'summary' : 'summary_large_image'} />
      <meta name='twitter:site' content='@maxkagamine' />
      {/* Structured Data */}
      {structuredData && (
        <script type='application/ld+json'>
          {JSON.stringify({ '@context': 'https://schema.org', ...structuredData })}
        </script>
      )}
    </Helmet>
    {/* Article-specific metadata */}
    {metadata?.type == 'article' && (
      <Helmet>
        <meta property='article:published_time' content={metadata.datePublished} />
        {metadata.dateUpdated && (
          <meta property='article:modified_time' content={metadata.dateUpdated} />
        )}
      </Helmet>
    )}
  </>;
}
