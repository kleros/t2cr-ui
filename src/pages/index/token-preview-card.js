import { Box, Card, Flex } from "theme-ui";

import { Image, Link, RouterLink, Status, Text } from "../../components";
import { itemStatusEnum } from "../../data";
import { EtherscanLogo } from "../../icons";

function TokenPreviewCard({ tokenPreview, network }) {
  const { name, ticker, address, symbolMultihash, id } = tokenPreview;
  return (
    <Card variant="token">
      <Box
        sx={{
          background: (theme) =>
            theme.colors[`muted${itemStatusEnum.parse(tokenPreview).key}`],
          paddingLeft: "24px",
          paddingY: "12px",
          borderTop: (theme) =>
            `5px solid ${
              theme.colors[itemStatusEnum.parse(tokenPreview).camelCase]
            }`,
          fontWeight: 400,
          fontSize: "16px",
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          color: (theme) =>
            theme.colors[itemStatusEnum.parse(tokenPreview).camelCase],
        }}
      >
        <Status item={tokenPreview} />
      </Box>
      <RouterLink variant="tokenPreview" to={`/token/${id}`}>
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
            src={`${process.env.REACT_APP_IPFS_GATEWAY}${symbolMultihash}`}
            sx={{ margin: "8px", maxHeight: "96px", objectFit: "contain" }}
          />
          <Text sx={{ margin: "8px" }}>
            {name} - {ticker}
          </Text>
        </Flex>
      </RouterLink>
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
