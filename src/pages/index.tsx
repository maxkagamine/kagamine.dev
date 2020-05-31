import { PageProps } from 'gatsby';
import React from 'react';
import { useIntl } from 'react-intl';
import { BlogPostCard } from '../components/BlogPostCard/BlogPostCard';
import { Layout } from '../components/Layout';

export default function Home({ location }: PageProps) {
  const intl = useIntl();
  return (
    <Layout location={location}>
      {new Array(5).fill(
        <BlogPostCard></BlogPostCard>
      )}
    </Layout>
  );
}
