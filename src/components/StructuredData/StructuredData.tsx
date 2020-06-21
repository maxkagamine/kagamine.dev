import React from 'react';
import { Helmet } from 'react-helmet';
import { Thing } from 'schema-dts';

type StructuredDataProps<T extends Thing> = Omit<Exclude<T, string>, '@type'> & {
  type: T extends { ['@type']: any } ? T['@type'] : any
};

export function StructuredData<T extends Thing>(props: StructuredDataProps<T>) {
  const { type, ...rest } = props;
  const data = {
    '@context': 'https://schema.org',
    '@type': type,
    ...rest
  };

  return (
    <Helmet>
      <script type='application/ld+json'>
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
