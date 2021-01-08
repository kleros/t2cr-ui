import {
  Box,
  Link,
  List,
  ListItem,
  NextLink,
  SocialIcons,
  Text,
  createWrapConnection,
} from "@kleros/components";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { graphql } from "relay-hooks";

import {
  Button,
  Layout,
  RelayProvider,
  ThemeProvider,
  Title,
} from "../components";
import { queryEnums } from "../data";
import { HamburgerMenu, Info, SecuredByKleros, T2CRLogo } from "../icons";
import { navigation } from "../utils";

const indexQuery = graphql`
  query AppQuery($skip: Int = 0, $first: Int = 9, $where: Token_filter) {
    tokens(skip: $skip, first: $first, where: $where) {
      status
      name
      ticker
      address
      symbolMultihash
      appealPeriodEnd
    }
  }
`;
const queries = {
  "/": indexQuery,
};
const wrapConnection = createWrapConnection(queries, queryEnums);

const header = {
  left: (
    <>
      <T2CRLogo />
      <Box sx={{ marginLeft: "8px" }}>
        <Text sx={{ fontWeight: "bold" }}>TOKENS</Text>
      </Box>
    </>
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
          <NextLink href={to}>
            <Link variant="navigation">{label}</Link>
          </NextLink>
        </ListItem>
      ))}
    </List>
  ),
};
const footer = {
  left: <SecuredByKleros />,
  right: (
    <>
      <NextLink href="/faq">
        <Link variant="footer" sx={{ display: "flex", alignItems: "center" }}>
          I need help{" "}
          <Info
            color="#fff"
            sx={{ marginLeft: "8px", marginRight: [0, 0, 0, "32px"] }}
          />
        </Link>
      </NextLink>
      <Box sx={{ display: ["none", "none", "inherit", "inherit"] }}>
        <SocialIcons />
      </Box>
    </>
  ),
};

export default function App({ Component, pageProps }) {
  // Sidebar menu handling.
  const [sideBarOpen, setSideBarOpen] = useState();
  const onSideBarClose = useCallback(() => setSideBarOpen(false), []);
  const openSidebar = useCallback(() => {
    setSideBarOpen(true);
  }, []);

  // Use URL to select which graphql node the app will query.
  const router = useRouter();
  const { network = "mainnet" } = useMemo(
    () => wrapConnection.parseAsPath(router.asPath).query,
    [router.asPath]
  );
  const [routeChangeConnection, setRouteChangeConnection] = useState();
  const connectToRouteChange = useCallback((connection) => {
    const wrappedConnection = wrapConnection(connection);
    wrappedConnection(location.pathname + location.search);
    setRouteChangeConnection(() => wrappedConnection);
  }, []);
  useEffect(() => {
    if (routeChangeConnection) {
      router.events.on("routeChangeStart", routeChangeConnection);
      return () => router.events.off("routeChangeStart", routeChangeConnection);
    }
  }, [routeChangeConnection, router.events]);

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
      <Head>
        <Title>Kleros · Tokens</Title>
      </Head>
      <RelayProvider
        endpoint={JSON.parse(process.env.NEXT_PUBLIC_GRAPH_ENDPOINTS)[network]}
        queries={queries}
        connectToRouteChange={connectToRouteChange}
      >
        <ThemeProvider>
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
                    <NextLink href={to}>
                      <Link variant="navigation">{label}</Link>
                    </NextLink>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Menu>
          <Layout header={{ ...header, right: hamburgerMenu }} footer={footer}>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </RelayProvider>
    </>
  );
}
