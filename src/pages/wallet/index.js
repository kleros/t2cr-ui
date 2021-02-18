/* eslint-disable jsx-a11y/accessible-emoji */
import { formatEther } from "@ethersproject/units";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import React from "react";
import { Box, Divider } from "theme-ui";

import { Text } from "../../components";
import { useWallet } from "../../providers";

function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError)
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  if (error instanceof UnsupportedChainIdError)
    return "You're connected to an unsupported network.";
  if (error instanceof UserRejectedRequestErrorInjected)
    return "Please authorize this website to access your Ethereum account.";

  console.error(error);
  return "An unknown error occurred. Check the console for more details.";
}

function ChainId() {
  const { chainId } = useWeb3React();

  return (
    <>
      <Box as="span">Chain Id</Box>
      <Box as="span" role="img" aria-label="chain">
        ⛓
      </Box>
      <Box as="span">{chainId ?? ""}</Box>
    </>
  );
}

function BlockNumber() {
  const { chainId, library } = useWeb3React();

  const [blockNumber, setBlockNumber] = React.useState();
  React.useEffect(() => {
    if (library) {
      let stale = false;

      library
        .getBlockNumber()
        .then((latestBlockNumber) => {
          if (!stale) setBlockNumber(latestBlockNumber);
        })
        .catch(() => {
          if (!stale) setBlockNumber(null);
        });

      const updateBlockNumber = (latestBlockNumber) => {
        setBlockNumber(latestBlockNumber);
      };
      library.on("block", updateBlockNumber);

      return () => {
        stale = true;
        library.removeListener("block", updateBlockNumber);
        setBlockNumber();
      };
    }
  }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <Box as="span">Block Number</Box>
      <Box as="span" role="img" aria-label="numbers">
        🔢
      </Box>
      <Box as="span">{blockNumber === null ? "Error" : blockNumber ?? ""}</Box>
    </>
  );
}

function Account() {
  const { account } = useWeb3React();

  return (
    <>
      <Box as="span">Account</Box>
      <Box as="span" role="img" aria-label="robot">
        🤖
      </Box>
      <Box as="span">
        {account === null
          ? "-"
          : account
          ? `${account.slice(0, 6)}...${account.slice(
              Math.max(0, account.length - 4)
            )}`
          : ""}
      </Box>
    </>
  );
}

function Balance() {
  const { account, library, chainId } = useWeb3React();

  const [balance, setBalance] = React.useState();
  React.useEffect(() => {
    if (!!account && !!library) {
      let stale = false;

      library
        .getBalance(account)
        .then((latestBalance) => {
          if (!stale) setBalance(latestBalance);
        })
        .catch(() => {
          if (!stale) setBalance(null);
        });

      return () => {
        stale = true;
        setBalance();
      };
    }
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <Box as="span">Balance</Box>
      <Box as="span" role="img" aria-label="gold">
        💰
      </Box>
      <Box as="span">
        {balance === null ? "Error" : balance ? `Ξ${formatEther(balance)}` : ""}
      </Box>
    </>
  );
}

function Header() {
  return (
    <Text
      sx={{
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: "1fr min-content 1fr",
        maxWidth: "20rem",
        lineHeight: "2rem",
        marginX: "auto",
        marginY: "32px",
      }}
    >
      <ChainId />
      <BlockNumber />
      <Account />
      <Balance />
    </Text>
  );
}

export default function Wallet() {
  const { error } = useWallet();

  return (
    <>
      <Header />
      <Box
        as="span"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!!error && (
          <>
            <Divider />
            <Text sx={{ marginTop: "1rem", marginBottom: "0" }}>
              {getErrorMessage(error)}
            </Text>
          </>
        )}
      </Box>
    </>
  );
}
