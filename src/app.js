/* eslint-disable react/forbid-elements */
/* eslint-disable unicorn/import-index */
/* eslint-disable import/no-useless-path-segments */
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Route,
  BrowserRouter as Router,
  Link as RouterLink,
  Switch,
  useParams,
} from "react-router-dom";
import { Box, Flex } from "theme-ui";
import Typography from "typography";
import injectFonts from "typography-inject-fonts";

import {
  Button,
  InitializeColorMode,
  Layout,
  List,
  ListItem,
  SocialIcons,
  Text,
  ThemeProvider,
  Title,
  typographyTheme,
} from "./components";
import { HamburgerMenu, Info, SecuredByKleros, T2CRLogo } from "./icons";
import Index from "./pages/index";
import Token from "./pages/token";
import { navigation } from "./utils";

const typography = new Typography(typographyTheme);
typography.injectStyles();
injectFonts(typography);

const header = {
  left: (
    <RouterLink to="/">
      <Flex sx={{ alignItems: "center" }}>
        <T2CRLogo />
        <Box sx={{ marginLeft: "8px" }}>
          <Text sx={{ fontWeight: "bold" }}>TOKENS</Text>
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
          <RouterLink to={to}>{label}</RouterLink>
        </ListItem>
      ))}
    </List>
  ),
};
const footer = {
  left: <SecuredByKleros />,
  right: (
    <>
      <RouterLink to="/faq">
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
  const { network = "mainnet" } = useParams();
  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        uri: JSON.parse(process.env.REACT_APP_GRAPH_ENDPOINTS)[network],
      }),
    [network]
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

  const hamburgerMenu = (
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
                    <ListItem key={index}>
                      <RouterLink to={to} onClick={onSideBarClose}>
                        {label}
                      </RouterLink>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Menu>
            <Layout
              header={{ ...header, right: hamburgerMenu }}
              footer={footer}
            >
              <Switch>
                <Route exact path="/">
                  <Index />
                </Route>
                <Route exact path="/token/:tokenID">
                  <Token />
                </Route>
                <Route>
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
        <title>Kleros · Tokens</title>
      </Helmet>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  );
}
