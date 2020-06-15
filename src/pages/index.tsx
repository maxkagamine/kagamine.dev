import { PageProps } from 'gatsby';
import React from 'react';
import { BlogButtons } from '../components/BlogButtons';
import { BlogPostCard } from '../components/BlogPostCard';
import { Layout } from '../components/Layout';

export default function HomePage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <BlogButtons />
      {new Array(5).fill(
        <BlogPostCard></BlogPostCard>
      )}
    </Layout>
  );
}
