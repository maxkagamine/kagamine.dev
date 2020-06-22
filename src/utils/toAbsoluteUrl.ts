/**
 * Joins siteUrl and relativeUrl, unless the latter is already absolute.
 *
 * @param siteUrl The site url.
 * @param relativeUrl A site-relative (or absolute) url.
 */
export function toAbsoluteUrl(siteUrl: string, relativeUrl: string) {
  if (relativeUrl.startsWith('https://') || relativeUrl.startsWith('http://')) {
    return relativeUrl;
  }
  if (siteUrl.endsWith('/')) {
    siteUrl = siteUrl.substr(0, siteUrl.length - 1);
  }
  if (!relativeUrl.startsWith('/')) {
    relativeUrl = `/${relativeUrl}`;
  }
  return `${siteUrl}${relativeUrl}`;
}
