import {
  Box,
  Link,
  List,
  ListItem,
  NextLink,
  Text,
  SocialIcons,
} from "@kleros/components";
import Head from "next/head";
import { useCallback, useState } from "react";

import { slide as Menu } from "react-burger-menu";
import { ThemeProvider, Button, Layout } from "../components";
import { SecuredByKleros, Info, T2CRLogo, HamburgerMenu } from "../icons";
import { navigation } from "../utils";

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
      {navigation.map(({ to, label }, i) => (
        <ListItem key={i}>
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
  const [sideBarOpen, setSideBarOpen] = useState();
  const onSideBarClose = useCallback(() => setSideBarOpen(false), []);
  const openSidebar = useCallback(() => {
    setSideBarOpen(true);
  }, []);
  const right = (
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
        <title>Kleros · Tokens</title>
      </Head>
      <ThemeProvider>
        <Menu
          right
          customBurgerIcon={false}
          isOpen={sideBarOpen}
          onClose={onSideBarClose}
        >
          <Box sx={{ backgroundColor: "#4d00b4", height: "100%" }}>
            <List sx={{ paddingTop: "24px", listStyle: "none" }}>
              {navigation.map(({ to, label }, i) => (
                <ListItem key={i}>
                  <NextLink href={to}>
                    <Link variant="navigation">{label}</Link>
                  </NextLink>
                </ListItem>
              ))}
            </List>
          </Box>
        </Menu>
        <Layout header={{ ...header, right }} footer={footer}>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}
