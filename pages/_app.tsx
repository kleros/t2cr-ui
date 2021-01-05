import {
  Box,
  Layout,
  Link,
  List,
  ListItem,
  NextLink,
  SocialIcons,
  Text,
} from '@kleros/components';
import { AppProps } from 'next/dist/next-server/lib/router/router';

import ThemeProvider from '../components/theme-provider';
import { SecuredByKleros, Info, T2CRLogo } from '../icons';

const header = {
  left: (
    <>
      <T2CRLogo />
      <Box sx={{ marginLeft: '8px' }}>
        <Text sx={{ fontWeight: 'bold' }}>TOKENS</Text>
      </Box>
    </>
  ),
  middle: (
    <List
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        listStyle: 'none',
        width: '100%',
      }}
    >
      <ListItem>
        <NextLink href="/">
          <Link variant="navigation">Tokens</Link>
        </NextLink>
      </ListItem>
      <ListItem>
        <NextLink href="/badges">
          <Link variant="navigation">Badges</Link>
        </NextLink>
      </ListItem>
      <ListItem>
        <NextLink href="/criteria">
          <Link variant="navigation">Criteria</Link>
        </NextLink>
      </ListItem>
      <ListItem>
        <NextLink href="/statistics">
          <Link variant="navigation">Statistics</Link>
        </NextLink>
      </ListItem>
    </List>
  ),
};
const footer = {
  left: <SecuredByKleros />,
  right: (
    <>
      <NextLink href="/faq">
        <Link variant="footer" sx={{ display: 'flex', alignItems: 'center' }}>
          I need help{' '}
          <Info color="#fff" sx={{ marginLeft: '8px', marginRight: '64px' }} />
        </Link>
      </NextLink>
      <SocialIcons />
    </>
  ),
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Layout header={header} footer={footer}>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
