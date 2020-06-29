import { GatsbyNode } from 'gatsby';
import { parse } from 'intl-messageformat-parser';
import mapValues from 'lodash.mapvalues';
import { LocalizedBlogOptions, Messages } from './types';

export const parsedMessages = new Map<string, Messages>();

export const onPreInit: GatsbyNode['onPreInit'] = (_, pluginOptions: LocalizedBlogOptions) => {
  let { locales = [], messages: messagesDir = {} } = pluginOptions;

  // Pre-parse messages at build time
  for (let locale of locales) {
    let messages = require(`${messagesDir}/${locale}.json`);
    let parsed = mapValues(messages, m => parse(m));
    parsedMessages.set(locale, parsed);
  }
};
