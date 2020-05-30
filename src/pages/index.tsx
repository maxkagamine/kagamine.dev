import { PageProps } from 'gatsby';
import React from 'react';
import { useIntl } from 'react-intl';
import { Layout } from '../components/Layout';

export default function Home({ location }: PageProps) {
  const intl = useIntl();
  return (
    <Layout location={location}>
      <div>{intl.formatMessage({ id: 'name' })}</div>
    </Layout>
  );
}
