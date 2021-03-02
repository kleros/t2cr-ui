import { useEffect, useState } from "react";
import { Box, Flex } from "theme-ui";

import { Card, Identicon, Link, Text } from "../../components";
import { EtherscanLogo, File } from "../../icons";
import { useWallet } from "../../providers";
import { chainIdToEtherscanName, truncateEthAddr } from "../../utils";

function EvidenceItem({
  evidence: { evidenceURI, submitter, submissionTime, hash },
  index,
}) {
  const { chainId = 1 } = useWallet();
  const [evidenceFile, setEvidenceFile] = useState();
  useEffect(
    () =>
      (async () =>
        setEvidenceFile(
          await (
            await fetch(`${process.env.REACT_APP_IPFS_GATEWAY}${evidenceURI}`)
          ).json()
        ))(),
    [evidenceURI]
  );

  return (
    <Card
      sx={{
        marginBottom: 2,
        boxShadow: "0 2px 3px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
      }}
      mainSx={{
        alignItems: "flex-start",
        flexDirection: "column",
        padding: "24px",
      }}
      footer={
        <Flex
          sx={{
            background: (theme) => theme.colors.accentMuted,
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "15px",
          }}
        >
          <Flex sx={{ alignItems: "center" }}>
            <Identicon diameter={28} address={submitter} />
            <Flex sx={{ flexDirection: "column", marginLeft: "8px" }}>
              <Text
                as="span"
                sx={{
                  fontSize: "14px",
                  color: (theme) => theme.colors.accent,
                }}
              >
                #{index} submitted by{" "}
                <Link
                  href={`https://${chainIdToEtherscanName[chainId]}etherscan.io/tx/${hash}`}
                >
                  {truncateEthAddr(submitter)}
                </Link>
              </Text>{" "}
              <Text
                sx={{ fontSize: "12px", color: (theme) => theme.colors.accent }}
              >
                {new Date(submissionTime * 1000).toGMTString()}
              </Text>
            </Flex>
          </Flex>
          {evidenceFile?.fileURI && (
            <Link newTab href={evidenceFile?.fileURI}>
              <File
                sx={{ stroke: "background", path: { fill: "primary" } }}
                size={28}
              />
            </Link>
          )}
        </Flex>
      }
    >
      <Text
        sx={{
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        {evidenceFile?.name}
      </Text>
      <Text>
        {evidenceFile?.description ||
          (evidenceFile ? "No description." : undefined)}
      </Text>
    </Card>
  );
}

export default EvidenceItem;
