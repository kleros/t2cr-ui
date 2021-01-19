import { Box, Flex, Image, Link, NextLink, Text } from "@kleros/components";
import { EtherscanLogo } from "@kleros/icons";
import { graphql, useFragment } from "relay-hooks";
import { Card, Label } from "theme-ui";

import { tokenStatusEnum } from "../../data";

const tokenPreviewCardFragment = graphql`
  fragment tokenPreviewCard on Token {
    id
    status
    name
    ticker
    address
    symbolMultihash
    disputed
    appealPeriodStart
    appealPeriodEnd
  }
`;

function TokenPreviewCard({ tokenPreviewFragment, network }) {
  const tokenPreview = useFragment(
    tokenPreviewCardFragment,
    tokenPreviewFragment
  );
  const { name, ticker, address, symbolMultihash, id } = tokenPreview;
  return (
    <Card variant="token">
      <Box
        sx={{
          background: (theme) =>
            theme.colors[`muted${tokenStatusEnum.parse(tokenPreview).key}`],
          paddingX: "24px",
          paddingY: "12px",
          borderTop: (theme) =>
            `5px solid ${
              theme.colors[tokenStatusEnum.parse(tokenPreview).camelCase]
            }`,
          fontWeight: 400,
          fontSize: "16px",
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          color: (theme) =>
            theme.colors[tokenStatusEnum.parse(tokenPreview).camelCase],
        }}
      >
        <Label
          sx={{
            height: 8,
            width: 8,
            backgroundColor: (theme) =>
              theme.colors[tokenStatusEnum.parse(tokenPreview).camelCase],
            borderRadius: "50%",
            display: "inline-block",
            marginBottom: 0,
            marginRight: 8,
          }}
        />
        {tokenStatusEnum.parse(tokenPreview).startCase}
      </Box>
      <NextLink href="/token/[id]" as={`/token/${id}`}>
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

export default TokenPreviewCard;