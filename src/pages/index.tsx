import { PageProps } from 'gatsby';
import React from 'react';
import { Layout } from '../components/Layout';

export default function Home({ location }: PageProps) {
  return (
    <Layout location={location}>
      <div>Stuff here</div>
    </Layout>
  );
}
