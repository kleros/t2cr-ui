import { BarLoader } from "react-spinners";
import { Box, Divider, Flex, useThemeUI } from "theme-ui";

import Authereum from "../assets/images/authereum.png";
import Frame from "../assets/images/frame.png";
import Torus from "../assets/images/torus.png";
import { MetaMask, Question, WalletConnect } from "../icons";
import { useWallet } from "../providers";

import { Button, Image, Link, Text } from ".";

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

export function WalletSelection({ activateWallet }) {
  const { activatingConnector } = useWallet();
  const { theme } = useThemeUI();
  const {
    activateInjected,
    activateTorus,
    activateAuthereum,
    activateWalletConnect,
    activateFrame,
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
        <WalletButton
          title="Frame"
          icon={<Image src={Frame} />}
          activate={activateFrame}
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
