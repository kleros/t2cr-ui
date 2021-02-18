/* eslint-disable unicorn/import-index */
/* eslint-disable import/no-useless-path-segments */
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useParams,
} from "react-router-dom";
import { Box, Divider, Flex } from "theme-ui";
import Typography from "typography";
import injectFonts from "typography-inject-fonts";

import {
  Button,
  InitializeColorMode,
  Layout,
  Link,
  List,
  ListItem,
  Network,
  Popup,
  RouterLink,
  SocialIcons,
  Text,
} from "./components";
import {
  HamburgerMenu,
  Info,
  MetaMask,
  SecuredByKleros,
  T2CRLogo,
} from "./icons";
import Index from "./pages/index";
import Token from "./pages/token";
import Wallet from "./pages/wallet";
import {
  ThemeProvider,
  WalletProvider,
  Web3ReactProvider,
  typographyTheme,
  useWallet,
} from "./providers";
import { navigation } from "./utils";

const typography = new Typography(typographyTheme);
typography.injectStyles();
injectFonts(typography);

function WalletButton({ title, icon: WalletIcon }) {
  return (
    <Button variant="wallet">
      <Flex
        sx={{
          backgroundColor: "#fbf9fe",
          padding: "22px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ marginBottom: "16px" }}>
          <WalletIcon />
        </Box>
        <Text>{title}</Text>
      </Flex>
    </Button>
  );
}

const buildHeader = ({ active, chainId }, hamburgerMenu) => ({
  left: (
    <RouterLink variant="navigation" to="/">
      <Flex sx={{ alignItems: "center" }}>
        <T2CRLogo />
        <Box sx={{ marginLeft: "8px" }}>
          <Text>TOKENS</Text>
        </Box>
      </Flex>
    </RouterLink>
  ),
  middle: (
    <List
      sx={{
        display: ["none", "none", "none", "flex"],
        justifyContent: "space-around",
        listStyle: "none",
        width: "100%",
      }}
    >
      {navigation.map(({ to, label }, index) => (
        <ListItem key={index}>
          <RouterLink variant="navigation" to={to}>
            {label}
          </RouterLink>
        </ListItem>
      ))}
    </List>
  ),
  right: (
    <Flex>
      <List
        sx={{
          display: ["none", "none", "none", "flex"],
          justifyContent: "flex-end",
          alignItems: "center",
          listStyle: "none",
          width: "100%",
        }}
      >
        <ListItem key={0}>
          {!active ? (
            <Popup
              trigger={<Button variant="dark">Connect</Button>}
              position="bottom right"
              contentStyle={{ minWidth: "380px" }}
              offsetY={25}
            >
              <Flex
                sx={{
                  padding: "32px",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text
                  sx={{
                    fontWeight: 500,
                    fontSize: "24px",
                    marginBottom: "24px",
                  }}
                >
                  Connect a Wallet
                </Text>
                <Flex>
                  <WalletButton title="MetaMask" icon={MetaMask} />
                </Flex>
                <Divider sx={{ width: "100%", marginTop: "32px" }} />
                <Link href="#">New to Ethereum? Learn more about wallets</Link>
              </Flex>
            </Popup>
          ) : (
            <Network chainId={chainId} />
          )}
        </ListItem>
      </List>
      {hamburgerMenu}
    </Flex>
  ),
});
const footer = {
  left: <SecuredByKleros />,
  right: (
    <>
      <RouterLink variant="navigation" to="/faq">
        I need help{" "}
        <Info
          color="#fff"
          sx={{ marginLeft: "8px", marginRight: [0, 0, 0, "32px"] }}
        />
      </RouterLink>
      <Box sx={{ display: ["none", "none", "inherit", "inherit"] }}>
        <SocialIcons />
      </Box>
    </>
  ),
};

function App() {
  const web3Context = useWallet();
  const { chainId = 1 } = web3Context || {};
  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        uri: JSON.parse(process.env.REACT_APP_GRAPH_ENDPOINTS)[chainId],
      }),
    [chainId]
  );
  // Sidebar menu handling.
  const [sideBarOpen, setSideBarOpen] = useState();
  const onSideBarClose = useCallback(() => setSideBarOpen(false), []);
  const openSidebar = useCallback(() => {
    setSideBarOpen(true);
  }, []);

  // Patch to deal with react-infinite-scroller issue #247.
  // https://github.com/danbovey/react-infinite-scroller/issues/247
  useEffect(() => {
    const __scrollTo = window.scrollTo;
    window.scrollTo = (x, y) => {
      if (x !== 0 && y !== 0) __scrollTo(x, y);
    };
  }, []);

  const hamburgerMenu = useMemo(
    () => (
      <Button
        sx={{
          display: ["initial", "initial", "initial", "none"],
          background: "transparent",
          cursor: "pointer",
        }}
        onClick={openSidebar}
      >
        <HamburgerMenu />
      </Button>
    ),
    [openSidebar]
  );

  const header = useMemo(() => buildHeader(web3Context, hamburgerMenu), [
    hamburgerMenu,
    web3Context,
  ]);

  return (
    <>
      <InitializeColorMode />
      <ThemeProvider>
        <ApolloProvider client={apolloClient}>
          <>
            <Menu
              right
              customBurgerIcon={false}
              isOpen={sideBarOpen}
              onClose={onSideBarClose}
            >
              <Box sx={{ backgroundColor: "#4d00b4", height: "100%" }}>
                <List sx={{ paddingTop: "24px", listStyle: "none" }}>
                  {navigation.map(({ to, label }, index) => (
                    <ListItem key={index} sx={{ marginLeft: "32px" }}>
                      <RouterLink
                        variant="navigation"
                        to={to}
                        onClick={onSideBarClose}
                      >
                        {label}
                      </RouterLink>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Menu>
            <Layout header={header} footer={footer}>
              <Switch>
                <Route exact path="/">
                  <Index />
                </Route>
                <Route path="/token/:tokenID">
                  <Token />
                </Route>
                <Route path="/wallet">
                  <Wallet />
                </Route>
                <Route path="*">
                  <Box>404</Box>
                </Route>
              </Switch>
            </Layout>
          </>
        </ApolloProvider>
      </ThemeProvider>
    </>
  );
}

export default function RoutedApp() {
  return (
    <HelmetProvider>
      <Helmet>
        {/* eslint-disable-next-line react/forbid-elements */}
        <title>Kleros · Tokens</title>
      </Helmet>
      <Router>
        <Web3ReactProvider>
          <WalletProvider>
            <App />
          </WalletProvider>
        </Web3ReactProvider>
      </Router>
    </HelmetProvider>
  );
}
