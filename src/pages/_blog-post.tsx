import { PageProps } from 'gatsby';
import React from 'react';
import { Layout } from '../components/Layout';

export default function BlogPostPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      blog post!
    </Layout>
  );
}
