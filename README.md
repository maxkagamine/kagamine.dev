# kagamine.dev&ensp;[![CI build](https://github.com/maxkagamine/kagamine.dev/workflows/CI%20build/badge.svg)](.github/workflows/deploy.yml)

[![Built with Gatsby, React, TypeScript, Firebase](https://github.com/maxkagamine/kagamine.dev/blob/4ed2540eef34076504d1665f2c5a836cb3c1a646/screenshot-promo-image.png)](https://kagamine.dev)

## Features

- Built entirely in **React** and **TypeScript** and served as a static site from Google's global CDN thanks to **Gatsby** and **Firebase Hosting**

- A **localized blog** with Markdown posts written in both English & Japanese and a **Firebase Cloud Function** redirecting users to either site based on their browser language (_blog post on this coming soon: [issue #1](https://github.com/maxkagamine/kagamine.dev/issues/1)_)

- One-click **push notifications** triggered automatically using the RSS feed for a more modern and user-friendly alternative to feed readers and newsletters, with **Firebase Cloud Messaging** eliminating most of the Web Push API hassle (_blog post on this coming soon: [issue #2](https://github.com/maxkagamine/kagamine.dev/issues/2)_)

  ![](https://github.com/maxkagamine/kagamine.dev/blob/4ed2540eef34076504d1665f2c5a836cb3c1a646/push-notifications-flow.png)

- Smooth header scaling adapts to any screen size using **linear interpolation** instead of fixed breakpoints (try resizing your browser!) (_util function that enables this to be put on npm: [issue #3](https://github.com/maxkagamine/kagamine.dev/issues/3)_)

- Custom GraphQL resolvers add **last updated dates from the git log** (_to be broken out as a plugin: [issue #4](https://github.com/maxkagamine/kagamine.dev/issues/4)_) and **auto-detect cover images**

- Share button on blog posts leveraging the **Web Share API**, with fallback dropdown menu for desktop (_to be broken out as a shared component: [issue #5](https://github.com/maxkagamine/kagamine.dev/issues/5)_) (_See: [Why You Should Be Using the Web Share API in Your PWA](https://www.danielworsnup.com/blog/why-you-should-be-using-the-web-share-api-in-your-pwa/)_)

  ![](https://github.com/maxkagamine/kagamine.dev/blob/4ed2540eef34076504d1665f2c5a836cb3c1a646/share-button.gif)

- Optimized **circular-cropped favicon.ico generated on build** from the same square profile image used in the manifest (for [maskable](https://web.dev/maskable-icon/) home screen icons) & Open Graph tags (for Twitter) using [create-ico](https://github.com/maxkagamine/create-ico) (_to be broken out as a plugin: [issue #6](https://github.com/maxkagamine/kagamine.dev/issues/6)_)

- **Post-build shenanigans** add 2.9 kb to every html file (right click view source!), plus one more easter egg hidden somewhere on the site

## Legal stuff

© Max Kagamine

Feel free to use my code as a reference to help build your own blog, but don't copy my site; this is not a theme! The contents of this repo should be considered "all rights reserved" unless otherwise noted.

Exception: the contents of the [plugins](plugins/) folder &mdash; _except for theme.ts_ &mdash; can be used under MIT license. Check this repo's issues, as the intention for some of these is to break them out into standalone plugins.

## Illegal stuff

[Pirates!](https://youtu.be/NSZhIAfR6dA)
