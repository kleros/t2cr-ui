import { BarLoader, MoonLoader } from "react-spinners";
import { Box, Divider, Flex, Label, useThemeUI } from "theme-ui";

import Authereum from "./assets/authereum.png";
import Torus from "./assets/torus.png";
import {
  Button,
  Identicon,
  Image,
  Link,
  List,
  ListItem,
  Network,
  Popup,
  RouterLink,
  Text,
} from "./components";
import {
  Bell,
  Book,
  Bug,
  Chat,
  Cog,
  EthSymbol,
  HamburgerMenu,
  Info,
  MetaMask,
  Question,
  Telegram,
  WalletConnect,
} from "./icons";
import { useWallet } from "./providers";
import { chainIdToColor, truncateEthAddr } from "./utils";

function WalletButton({ title, icon, activate }) {
  return (
    <Button
      variant="wallet"
      onClick={activate}
      sx={{
        margin: "8px",
      }}
    >
      <Flex
        sx={{
          width: "90px",
          height: "120px",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fbf9fe",
          padding: "16px",
          border: (theme) => `1px solid ${theme.colors.skeleton}`,
          borderRadius: 3,
        }}
      >
        <Box sx={{ marginBottom: "8px" }}>{icon}</Box>
        <Text sx={{ fontSize: "12px", lineHeight: "16px" }}>{title}</Text>
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

function HelpListItem({ label, icon: Icon }) {
  const { theme } = useThemeUI();
  return (
    <ListItem
      sx={{
        display: "flex",
        alignItems: "center",
        marginY: "12px",
        cursor: "pointer",
      }}
    >
      <Icon color={theme.colors.accent} />
      <Text sx={{ fontSize: "16px", marginLeft: "8px" }}>{label}</Text>
    </ListItem>
  );
}

export function WalletSelection({ activateWallet }) {
  const { activatingConnector } = useWallet();
  const { theme } = useThemeUI();
  const {
    activateInjected,
    activateTorus,
    activateAuthereum,
    activateWalletConnect,
  } = activateWallet;

  if (activatingConnector)
    return (
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
          Connecting...
          <BarLoader />
        </Text>
      </Flex>
    );

  return (
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
      <Flex sx={{ flexWrap: "wrap", justifyContent: "center" }}>
        <WalletButton
          title="MetaMask"
          icon={<MetaMask width={42} />}
          activate={activateInjected}
        />
        <WalletButton
          title={
            <Text>
              Wallet
              <Box as="br" />
              Connect
            </Text>
          }
          icon={<WalletConnect width={42} />}
          activate={activateWalletConnect}
        />
        <WalletButton
          title="Torus"
          icon={<Image src={Torus} />}
          activate={activateTorus}
        />
        <WalletButton
          title="Authereum"
          icon={<Image src={Authereum} />}
          activate={activateAuthereum}
        />
      </Flex>
      <Divider
        sx={{
          width: "100%",
          marginTop: "32px",
          marginBottom: "14px",
        }}
      />
      <Link
        sx={{
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
        }}
        href="#"
      >
        New to Ethereum? Learn more about wallets
        <Flex sx={{ marginLeft: "8px", alignItems: "center" }}>
          <Question color={theme.colors.primary} />
        </Flex>
      </Link>
    </Flex>
  );
}

const chainIdToEtherscanName = {
  1: "",
  42: "kovan.",
};

export default function Controls({
  openSidebar,
  web3ReactContext,
  activateWallet,
}) {
  const { theme } = useThemeUI();
  const { chainId, deactivate, account, active, txManagement } = useWallet();
  const { txes } = txManagement;

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
              trigger={
                <Button variant="dark" sx={{ marginX: "8px" }}>
                  Connect
                </Button>
              }
              position="bottom right"
              sx={{ minWidth: "380px" }}
              offsetY={18}
            >
              <WalletSelection activateWallet={activateWallet} />
            </Popup>
          ) : (
            <Network sx={{ marginRight: "16px" }} chainId={chainId} />
          )}
        </ListItem>
        <ListItem>
          <Popup
            trigger={
              <Button variant="invisible" sx={{ marginX: "8px" }}>
                <Bell />
              </Button>
            }
            position="bottom right"
            sx={{ minWidth: "380px" }}
            offsetY={18}
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
                {Object.key(txes).length === 0 && "Nothing here yet."}
                <List>
                  {Object.entries(txes).map(([txHash, tx]) => {
                    const pending = tx.confirmations && tx.confirmations > 0;
                    const { tokenID } = tx;
                    return (
                      <ListItem key={txHash} sx={{ display: "flex" }}>
                        {pending ? <MoonLoader /> : <Info />}
                        <Flex sx={{ flexDirection: "column" }}>
                          <Text>
                            {pending
                              ? "Transaction pending..."
                              : "Transaction confirmed"}
                          </Text>
                          <Link
                            href={`https://${chainIdToEtherscanName[chainId]}etherscan.io/tx/${txHash}`}
                          >
                            View on Etherscan.
                          </Link>
                          {!pending && tokenID && (
                            <RouterLink to={`/tokens/${tokenID}`}>
                              View Token
                            </RouterLink>
                          )}
                        </Flex>
                      </ListItem>
                    );
                  })}
                </List>
              </Flex>
            </Flex>
          </Popup>
        </ListItem>
        <ListItem>
          <Popup
            trigger={
              <Button variant="invisible" sx={{ marginX: "8px" }}>
                <Cog />
              </Button>
            }
            position="bottom right"
            sx={{ minWidth: "380px" }}
            offsetY={18}
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
                      color: theme.colors.error,
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
              <Link
                sx={{ fontSize: "14px", display: "flex", alignItems: "center" }}
                href="#"
              >
                Any Doubts? Visit our FAQ
                <Flex sx={{ marginLeft: "8px", alignItems: "center" }}>
                  <Question color={theme.colors.primary} />
                </Flex>
              </Link>
            </Flex>
          </Popup>
        </ListItem>
        <ListItem>
          <Popup
            trigger={
              <Button variant="invisible" sx={{ marginLeft: "8px" }}>
                <Question />
              </Button>
            }
            position="bottom right"
            sx={{
              minWidth: "248px",
            }}
            offsetY={18}
          >
            <List
              sx={{
                listStyle: "none",
                width: "100%",
                paddingX: "16px",
                paddingY: "8px",
              }}
            >
              <HelpListItem label="Get Help" icon={Telegram} />
              <HelpListItem label="Report a Bug" icon={Bug} />
              <HelpListItem label="Give Feedback" icon={Chat} />
              <HelpListItem label="Dapp Guide" icon={Book} />
              <HelpListItem label="Crypto Begginner's Guide" icon={EthSymbol} />
              <HelpListItem label="FAQ" icon={Question} />
            </List>
          </Popup>
        </ListItem>
      </List>
      <HamburgerButton openSidebar={openSidebar} />
    </Flex>
  );
}
