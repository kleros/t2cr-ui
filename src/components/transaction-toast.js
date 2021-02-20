import ReactLoadingSkeleton from "react-loading-skeleton";
import { SyncLoader } from "react-spinners";
import { Box, Flex, useThemeUI } from "theme-ui";

import { Info } from "../icons";
import { useWallet } from "../providers";
import { chainIdToEtherscanName } from "../utils";

import { Link, RouterLink, Text } from ".";

export default function TransactionToast({ tx }) {
  const { chainId, active } = useWallet();
  const { theme } = useThemeUI();
  const { tokenID, confirmations } = tx || {};
  const pending = !confirmations || confirmations <= 0;

  if (!active) return <ReactLoadingSkeleton />;
  return (
    <Flex>
      {pending ? (
        <SyncLoader size={6} color={theme.colors.info} />
      ) : (
        <Box sx={{ marginTop: "8px" }}>
          <Info size={24} color={theme.colors.success} />
        </Box>
      )}
      <Flex sx={{ flexDirection: "column", marginLeft: "16px" }}>
        <Text sx={{ fontSize: "16px", fontWeight: 600, color: "black" }}>
          {pending ? "Transaction pending..." : "Transaction confirmed"}
        </Text>
        <Link
          href={`https://${chainIdToEtherscanName[chainId]}etherscan.io/tx/${tx.hash}`}
          sx={{ fontSize: "14px", color: theme.colors.primary }}
        >
          View on Etherscan.
        </Link>
        {!pending && tokenID && (
          <RouterLink
            sx={{ fontSize: "14px", color: theme.colors.primary }}
            to={`/token/${tokenID}`}
          >
            View Token
          </RouterLink>
        )}
      </Flex>
    </Flex>
  );
}
