import type { LinksFunction } from '@remix-run/node';

import styles from '~/styles/index.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles  }
];

const Index = (): JSX.Element => {
  return <div>666</div>;
};

export default Index;