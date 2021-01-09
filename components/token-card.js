import { Box, Flex, Image, Link, Text } from "@kleros/components";
import { EtherscanLogo } from "@kleros/icons";
import { Card } from "theme-ui";

import { tokenStatusEnum } from "../data";

function TokenCard({ token, network }) {
  const { status, name, ticker, address, symbolMultihash } = token;
  return (
    <Card variant="token">
      <Box
        sx={{
          background: (theme) =>
            theme.colors[`muted${tokenStatusEnum.parse(token).key}`],
          paddingX: "24px",
          paddingY: "12px",
          borderTop: (theme) =>
            `5px solid ${theme.colors[tokenStatusEnum.parse(token).camelCase]}`,
          fontWeight: 400,
          fontSize: "16px",
          borderRadius: 3,
        }}
      >
        {tokenStatusEnum[status].startCase}
      </Box>
      <Flex
        sx={{ alignItems: "center", flexDirection: "column", padding: "8px" }}
      >
        <Image
          width={96}
          src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${symbolMultihash}`}
          sx={{ margin: "8px", maxHeight: "96px", objectFit: "contain" }}
        />
        <Text sx={{ margin: "8px" }}>
          {name} - {ticker}
        </Text>
      </Flex>
      <Flex
        sx={{
          justifyContent: "space-between",
          marginTop: "8px",
          paddingX: "24px",
          backgroundColor: "#fbf9fe",
          borderRadius: "8px",
          height: 45,
          alignItems: "center",
        }}
      >
        <Box /> {/* TODO: Display badges here */}
        <Link
          href={`https://${
            network ? `${network}.` : ""
          }etherscan.io/token/${address}`}
        >
          <EtherscanLogo />
        </Link>
      </Flex>
    </Card>
  );
}

export default TokenCard;
