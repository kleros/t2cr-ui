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
import { useRouter } from 'next/router';

import ThemeProvider from '../components/theme-provider';
import SecuredByKleros from '../icons/secured-by-kleros';
import T2CRLogo from '../icons/t2cr-logo';

const theme = {
  colors: {
    accent: '#501caf',
    accentComplement: '#501caf',
  },
};

const header = {
  left: (
    <>
      <T2CRLogo />
      <Box sx={{ marginLeft: '8px' }}>
        <Text>Tokens</Text>
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
const footer = { left: <SecuredByKleros />, right: <SocialIcons /> };

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Layout header={header} footer={footer}>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
