import { Box, Divider, Flex, Label } from "theme-ui";

import {
  Button,
  Identicon,
  Link,
  List,
  ListItem,
  Network,
  Popup,
  Text,
} from "./components";
import { HamburgerMenu, MetaMask } from "./icons";
import { chainIdToColor, truncateEthAddr } from "./utils";

function WalletButton({ title, icon: WalletIcon, activate }) {
  return (
    <Button variant="wallet" onClick={activate}>
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

function HamburgerButton({ openSidebar }) {
  return (
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
}

export default function Controls({
  openSidebar,
  web3ReactContext,
  activateWallet,
}) {
  const { chainId, deactivate, account, active } = web3ReactContext;
  const { activateInjected } = activateWallet;

  return (
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
        <ListItem>
          {!active ? (
            <Popup
              trigger={<Button variant="dark">Connect</Button>}
              position="bottom right"
              contentStyle={{ minWidth: "380px" }}
              offsetY={14}
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
                  <WalletButton
                    title="MetaMask"
                    icon={MetaMask}
                    activate={activateInjected}
                  />
                </Flex>
                <Divider
                  sx={{
                    width: "100%",
                    marginTop: "32px",
                    marginBottom: "14px",
                  }}
                />
                <Link sx={{ fontSize: "14px" }} href="#">
                  New to Ethereum? Learn more about wallets
                </Link>
              </Flex>
            </Popup>
          ) : (
            <Network chainId={chainId} />
          )}
        </ListItem>
        <ListItem>
          <Popup
            trigger={<Button>B</Button>}
            position="bottom right"
            contentStyle={{ minWidth: "380px" }}
            offsetY={14}
          >
            <Flex
              sx={{
                padding: "24px",
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
                Activity
              </Text>
              <Divider sx={{ width: "100%" }} />
              <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
                Nothing here yet.
              </Flex>
            </Flex>
          </Popup>
        </ListItem>
        <ListItem>
          <Popup
            trigger={<Button>G</Button>}
            position="bottom right"
            contentStyle={{ minWidth: "380px" }}
            offsetY={14}
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
                Settings
              </Text>
              <Flex>
                {active ? (
                  <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
                    <Network chainId={chainId} sx={{ marginBottom: "30px" }} />
                    <Identicon address={account} />
                    <Text sx={{ fontSize: "14px", marginTop: "8px" }}>
                      {truncateEthAddr(account)}
                    </Text>
                    <Button variant="link" onClick={deactivate}>
                      Disconnect
                    </Button>
                  </Flex>
                ) : (
                  <Flex
                    sx={{
                      alignItems: "center",
                      textTransform: "capitalize",
                      fontSize: ["16px", "14px", "12px", "14px"],
                      color: (theme) => theme.colors.error,
                    }}
                  >
                    <Label
                      sx={{
                        height: 8,
                        width: 8,
                        backgroundColor: chainIdToColor(chainId),
                        borderRadius: "50%",
                        display: "inline-block",
                        marginBottom: 0,
                        marginRight: 8,
                      }}
                    />
                    No wallet found. Connect your wallet.
                  </Flex>
                )}
              </Flex>
              <Divider
                sx={{ width: "100%", marginTop: "32px", marginBottom: "14px" }}
              />
              <Link sx={{ fontSize: "14px" }} href="#">
                Any Doubts? Visit our FAQ
              </Link>
            </Flex>
          </Popup>
        </ListItem>
      </List>
      <HamburgerButton openSidebar={openSidebar} />
    </Flex>
  );
}
