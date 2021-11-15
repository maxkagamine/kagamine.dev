# kagamine.dev&ensp;[![Follow][follow button]][follow]

[follow]: https://twitter.com/intent/follow?screen_name=maxkagamine
[follow button]: https://img.shields.io/twitter/follow/maxkagamine?style=social

[![Built with Gatsby, React, TypeScript, and Firebase](https://github.com/maxkagamine/kagamine.dev/blob/4ed2540eef34076504d1665f2c5a836cb3c1a646/screenshot-promo-image.png)](https://kagamine.dev)

## Features

- Built entirely in **React** and **TypeScript** and served as a static site from Google's global CDN thanks to **Gatsby** and **Firebase Hosting**

- **Localized blog** with Markdown posts written in both English & Japanese and a **Firebase Cloud Function** redirecting users to either site based on their browser language

- One-click **push notifications** triggered automatically using the RSS feed with **Firebase Cloud Messaging** eliminating (most of) the Web Push API hassle

  ![](https://github.com/maxkagamine/kagamine.dev/blob/4ed2540eef34076504d1665f2c5a836cb3c1a646/push-notifications-flow.png)

- Smooth header scaling adapts to any screen size using linear interpolation instead of fixed breakpoints (try resizing your browser)

- Custom GraphQL resolvers add **last updated dates from the git log** and auto-detect cover images

- Share button on blog posts leveraging the Web Share API, with fallback dropdown menu for desktop

  ![](https://github.com/maxkagamine/kagamine.dev/blob/4ed2540eef34076504d1665f2c5a836cb3c1a646/share-button.gif)

- Post-build shenanigans add 2.9 kb to every html file (right click view source 😉)

## Legal stuff

© Max Kagamine. (This is not a theme.)

## Illegal stuff

[Pirates!](https://youtu.be/NSZhIAfR6dA)
