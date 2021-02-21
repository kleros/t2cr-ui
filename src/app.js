/* eslint-disable unicorn/import-index */
/* eslint-disable import/no-useless-path-segments */
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useCallback, useMemo, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Box, Flex } from "theme-ui";
import Typography from "typography";
import injectFonts from "typography-inject-fonts";
import "react-toastify/dist/ReactToastify.min.css";

import {
  InitializeColorMode,
  Layout,
  List,
  ListItem,
  Popup,
  RouterLink,
  SocialIcons,
  Text,
} from "./components";
import { WalletSelection } from "./components/wallet-selection";
import Controls from "./controls";
import { Info, SecuredByKleros, T2CRLogo } from "./icons";
import Index from "./pages/index";
import Token from "./pages/token";
import {
  ActivityProvider,
  ConnectorNames,
  ContractsProvider,
  ThemeProvider,
  WalletProvider,
  Web3ReactProvider,
  connectorsByName,
  typographyTheme,
  useWallet,
} from "./providers";

const typography = new Typography(typographyTheme);
typography.injectStyles();
injectFonts(typography);

const navigation = [
  {
    to: "/",
    label: "Tokens",
  },
  {
    to: "/badges",
    label: "Badges",
  },
  {
    to: "/criteria",
    label: "Criteria",
  },
  {
    to: "/statistics",
    label: "Statistics",
  },
];

const buildHeader = (activateWallet, openSidebar) => ({
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
  right: <Controls openSidebar={openSidebar} activateWallet={activateWallet} />,
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
  const { chainId = 1, activate, walletModalControls } = web3Context || {};
  const { walletModalOpen, closeWalletModal } = walletModalControls;

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
  const activateWallet = useMemo(
    () => ({
      activateInjected: () =>
        activate(connectorsByName[ConnectorNames.Injected]),
      activateTorus: () => activate(connectorsByName[ConnectorNames.Torus]),
      activateAuthereum: () =>
        activate(connectorsByName[ConnectorNames.WalletConnect]),
      activateWalletConnect: () =>
        activate(connectorsByName[ConnectorNames.Authereum]),
      activateFrame: () => activate(connectorsByName[ConnectorNames.Frame]),
    }),
    [activate]
  );

  const header = useMemo(() => buildHeader(activateWallet, openSidebar), [
    activateWallet,
    openSidebar,
  ]);

  return (
    <>
      <InitializeColorMode />
      <ThemeProvider>
        <ApolloProvider client={apolloClient}>
          <ContractsProvider>
            <ActivityProvider>
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
                    <Route path="*">
                      <Box>404</Box>
                    </Route>
                  </Switch>
                </Layout>
                <Popup
                  open={walletModalOpen}
                  closeOnDocumentClick
                  onClose={closeWalletModal}
                >
                  <WalletSelection activateWallet={activateWallet} />
                </Popup>
              </>
              <ToastContainer />
            </ActivityProvider>
          </ContractsProvider>
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
