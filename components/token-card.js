import { Box, Flex, Image, Link, NextLink, Text } from "@kleros/components";
import { EtherscanLogo } from "@kleros/icons";
import { Card } from "theme-ui";

import { tokenStatusEnum } from "../data";

function TokenCard({ token, network }) {
  const { name, ticker, address, symbolMultihash, id } = token;
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
        {tokenStatusEnum.parse(token).startCase}
      </Box>
      <NextLink href="/profile/[id]" as={`/profile/${id}`}>
        <Flex
          sx={{
            alignItems: "center",
            flexDirection: "column",
            padding: "8px",
            textAlign: "center",
            cursor: "pointer",
          }}
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
      </NextLink>
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
