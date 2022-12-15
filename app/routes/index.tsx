import type { LinksFunction } from '@remix-run/node';
import {
  EuiPageTemplate,
  EuiPanel,
  EuiProvider,
  EuiSpacer,
  EuiFlexItem,
  EuiFlexGroup
} from '@elastic/eui';

import NetworkView from '~/views/network';

import styles from '~/styles/index.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles }
];

const Index = (): JSX.Element => {
  return (
    <EuiProvider colorMode='light'>
      <EuiPageTemplate
        panelled={false}
        restrictWidth={false}
      >
        <EuiPageTemplate.Sidebar>

        </EuiPageTemplate.Sidebar>
        <EuiPageTemplate.Section grow={true}>
          <EuiFlexGroup direction='column'>
            <EuiFlexItem grow={1}>
              <EuiFlexGroup>
                <EuiFlexItem grow={1}>
                  <EuiPanel>
                    <NetworkView />
                  </EuiPanel>
                </EuiFlexItem>
                <EuiFlexItem grow={3}>
                  <EuiPanel>
                    666
                  </EuiPanel>
                  <EuiSpacer />
                  <EuiPanel>
                    666
                  </EuiPanel>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={1}>
              <EuiFlexGroup>
                <EuiFlexItem grow={1}>
                  <EuiPanel>
                    666
                  </EuiPanel>
                </EuiFlexItem>
                <EuiFlexItem grow={1}>
                  <EuiPanel>
                    666
                  </EuiPanel>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPageTemplate.Section>
      </EuiPageTemplate>
    </EuiProvider>
  );
};

export default Index;