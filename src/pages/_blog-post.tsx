import React from 'react';
import { Layout } from '../components/Layout';
import { LocalizedPageProps } from '../utils/LocalizedPageProps';

export default function BlogPostPage({ location, pageContext: { translations } }: LocalizedPageProps) {
  return (
    <Layout location={location} translations={translations}>
      blog post!
    </Layout>
  );
}
