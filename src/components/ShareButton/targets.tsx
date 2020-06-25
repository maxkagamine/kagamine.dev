import React from 'react';
import { ShareTarget, ShareTargetProps } from './ShareTarget';

/**
 * Creates a preset ShareTarget component.
 *
 * @param name The share target name to display in the list item.
 * @param baseUrl The share target's url template with {title} and {url}
 * placeholders, onto which any extra props will be added.
 * @param extraProps An array of extra, target-specific query string params,
 * exposed as props on the returned component.
 * @param domain The share target's domain, for showing a favicon, if different
 * from url.
 */
export function createShareTarget<K extends string = never>(name: string, baseUrl: string, extraProps: K[] = [], domain?: string) {
  return React.forwardRef<HTMLLIElement, ShareTargetProps & { [key in K]?: string }>((props, ref) => {
    // Extract extra props and add to url
    let rest: any = {};
    let url = baseUrl;
    for (let [key, value] of Object.entries(props)) {
      if ((extraProps as string[]).includes(key)) {
        url += `&${key}=${encodeURIComponent(value as string)}`;
      } else {
        rest[key] = value;
      }
    }
    // Return share target
    return <ShareTarget domain={domain} {...rest} url={url} ref={ref}>{props.children ?? name}</ShareTarget>;
  });
}

export const TwitterShareTarget = createShareTarget('Twitter', 'https://twitter.com/intent/tweet?text={title}&url={url}', ['via', 'hashtags', 'related']);
export const RedditShareTarget = createShareTarget('Reddit', 'https://www.reddit.com/submit?title={title}&url={url}');
export const LineShareTarget = createShareTarget('LINE', 'https://social-plugins.line.me/lineit/share?url={url}', [], 'line.me');
export const LinkedInShareTarget = createShareTarget('LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url={url}');
export const HackerNewsShareTarget = createShareTarget('Hacker News', 'https://news.ycombinator.com/submitlink?u={url}&t={title}');
