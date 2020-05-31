import { PageProps } from 'gatsby';
import React from 'react';
import { useIntl } from 'react-intl';
import { BlogButtons } from '../components/BlogButtons';
import { BlogPostCard } from '../components/BlogPostCard';
import { Layout } from '../components/Layout';

export default function Home({ location }: PageProps) {
  const intl = useIntl();
  return (
    <Layout location={location}>
      <BlogButtons />
      {new Array(5).fill(
        <BlogPostCard></BlogPostCard>
      )}
    </Layout>
  );
}
