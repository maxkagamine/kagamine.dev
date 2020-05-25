import React from 'react';
import { PageProps } from 'gatsby';
import Layout from '../components/Layout';

export default function Home({ location }: PageProps) {
  return (
    <Layout location={location}>
      Hello world!
    </Layout>
  );
}
