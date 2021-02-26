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
      sx={{ marginBottom: 2 }}
      mainSx={{ alignItems: "flex-start", flexDirection: "column" }}
      footer={
        <>
          <Flex sx={{ alignItems: "center" }}>
            <Identicon address={submitter} />
            <Box sx={{ marginLeft: 1 }}>
              <Text>
                <Text as="span" sx={{ fontWeight: "bold" }}>
                  #{index}
                </Text>{" "}
                submitted by{" "}
                <Link
                  href={`https://${chainIdToEtherscanName[chainId]}etherscan.io/tx/${hash}`}
                >
                  <EtherscanLogo />
                  <Text sx={{ fontSize: "14px", marginTop: "8px" }}>
                    {truncateEthAddr(submitter)}
                  </Text>
                </Link>
              </Text>
              <Text>{submissionTime}</Text>
            </Box>
          </Flex>
          {evidenceFile?.fileURI && (
            <Link newTab href={evidenceFile?.fileURI}>
              <File sx={{ stroke: "background", path: { fill: "primary" } }} />
            </Link>
          )}
        </>
      }
      footerSx={{ justifyContent: "space-between", paddingX: 3 }}
    >
      <Text
        sx={{
          fontSize: 2,
          fontWeight: "bold",
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
