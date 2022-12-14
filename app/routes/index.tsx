import type { LinksFunction } from '@remix-run/node';

import NetworkView from '~/views/network';

import styles from '~/styles/index.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles  }
];

const Index = (): JSX.Element => {
  return <NetworkView />;
  // return <div>666</div>;
};

export default Index;