import { Divider, Flex, Label, useThemeUI } from "theme-ui";

import {
  Button,
  Identicon,
  Link,
  List,
  ListItem,
  Network,
  Popup,
  Text,
  TransactionToast,
} from "./components";
import { WalletSelection } from "./components/wallet-selection";
import {
  Bell,
  Book,
  Bug,
  Chat,
  Cog,
  EthSymbol,
  HamburgerMenu,
  Question,
  Telegram,
} from "./icons";
import { useActivity, useWallet } from "./providers";
import { chainIdToColor, truncateEthAddr } from "./utils";

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

export default function Controls({ openSidebar, activateWallet }) {
  const walletContext = useWallet();
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const { chainId, deactivate, account, active } = walletContext;
  const { txes } = useActivity();

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
              contentStyle={{ minWidth: "380px" }}
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
            contentStyle={{ minWidth: "380px" }}
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
              <Flex
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {Object.keys(txes).length === 0 && "Nothing here yet."}
                <List
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    listStyle: "none",
                  }}
                >
                  {Object.entries(txes).map(([, tx]) => (
                    <ListItem key={tx.hash}>
                      <TransactionToast tx={tx} />
                    </ListItem>
                  ))}
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
            contentStyle={{ minWidth: "380px" }}
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
                    {account && <Identicon address={account} />}
                    {account && (
                      <Text sx={{ fontSize: "14px", marginTop: "8px" }}>
                        {truncateEthAddr(account)}
                      </Text>
                    )}
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
            contentStyle={{ minWidth: "380px" }}
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
