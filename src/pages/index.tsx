import React from 'react';
import { BlogButtons } from '../components/BlogButtons';
import { BlogPostCard } from '../components/BlogPostCard';
import { Layout } from '../components/Layout';
import { LocalizedPageProps } from '../utils/LocalizedPageProps';

export default function HomePage({ location, pageContext: { translations } }: LocalizedPageProps) {
  return (
    <Layout location={location} translations={translations}>
      <BlogButtons />
      {new Array(5).fill(
        <BlogPostCard></BlogPostCard>
      )}
    </Layout>
  );
}
