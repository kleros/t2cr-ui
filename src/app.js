/* eslint-disable unicorn/import-index */
/* eslint-disable import/no-useless-path-segments */
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useCallback, useMemo, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Box, Flex } from "theme-ui";
import Typography from "typography";
import injectFonts from "typography-inject-fonts";

import {
  InitializeColorMode,
  Layout,
  List,
  ListItem,
  RouterLink,
  SocialIcons,
  Text,
} from "./components";
import Controls from "./controls";
import { Info, SecuredByKleros, T2CRLogo } from "./icons";
import Index from "./pages/index";
import Token from "./pages/token";
import Wallet from "./pages/wallet";
import {
  ConnectorNames,
  ThemeProvider,
  WalletProvider,
  Web3ReactProvider,
  connectorsByName,
  typographyTheme,
  useWallet,
} from "./providers";
import { navigation } from "./utils";

const typography = new Typography(typographyTheme);
typography.injectStyles();
injectFonts(typography);

const buildHeader = (web3ReactContext, activateWallet, openSidebar) => ({
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
    <Controls
      openSidebar={openSidebar}
      web3ReactContext={web3ReactContext}
      activateWallet={activateWallet}
    />
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
  const { chainId = 1, activate } = web3Context || {};

  // Supported wallets.
  const activateInjected = useCallback(() => {
    activate(connectorsByName[ConnectorNames.Injected]);
  }, [activate]);
  const activateTorus = useCallback(() => {
    activate(connectorsByName[ConnectorNames.Torus]);
  }, [activate]);
  const activateWalletConnect = useCallback(() => {
    activate(connectorsByName[ConnectorNames.WalletConnect]);
  }, [activate]);
  const activateAuthereum = useCallback(() => {
    activate(connectorsByName[ConnectorNames.Authereum]);
  }, [activate]);

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

  const header = useMemo(
    () =>
      buildHeader(
        web3Context,
        {
          activateInjected,
          activateTorus,
          activateAuthereum,
          activateWalletConnect,
        },
        openSidebar
      ),
    [
      activateAuthereum,
      activateInjected,
      activateTorus,
      activateWalletConnect,
      openSidebar,
      web3Context,
    ]
  );

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
