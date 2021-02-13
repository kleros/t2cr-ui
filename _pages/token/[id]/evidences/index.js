import { Card, Link, NextETHLink, Text } from "@kleros/components";
import { DownArrow, UpArrow } from "@kleros/icons";
import { useEffect, useState } from "react";
import { Box, Flex } from "theme-ui";

import { Identicon, ScrollArea, ScrollTo } from "../../../../components";
import { File } from "../../../../icons";
import { truncateEthAddr } from "../../../../utils";

import SubmitEvidenceButton from "./submit-button";

const intlDateTimeFormat = new Intl.DateTimeFormat("default", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  timeZoneName: "short",
  hour12: false,
});

function EvidenceItem({
  evidence: { submitter, submissionTime, evidenceURI },
  index,
}) {
  const [evidenceFile, setEvidenceFile] = useState();
  useEffect(() => {
    (async () => {
      setEvidenceFile(
        await (
          await fetch(`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${evidenceURI}`)
        ).json()
      );
    })();
  }, [evidenceURI]);

  return (
    <Card
      sx={{
        marginBottom: 3,
        boxShadow: "0 6px 24px rgba(77, 0, 180, 0.25)",
        borderRadius: "3px",
      }}
      mainSx={{
        alignItems: "flex-start",
        flexDirection: "column",
        padding: 24,
      }}
      footer={
        <>
          <Flex
            sx={{
              alignItems: "center",
            }}
          >
            <Identicon address={submitter} />
            <Box
              sx={{
                marginLeft: 1,
                color: (theme) => theme.colors.accent,
                fontSize: "14px",
              }}
            >
              <Text>
                <Text as="span">#{index}</Text> submitted by{" "}
                <NextETHLink address={submitter}>
                  {truncateEthAddr(submitter)}
                </NextETHLink>
              </Text>
              <Text>
                {intlDateTimeFormat.format(new Date(submissionTime * 1000))}
              </Text>
            </Box>
          </Flex>
          {evidenceFile?.fileURI && (
            <Link
              newTab
              href={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${evidenceFile?.fileURI}`}
            >
              <File width={24} height={24} color="#009aff" />
            </Link>
          )}
        </>
      }
      footerSx={{
        justifyContent: "space-between",
        background: "#fbf9fe",
        borderRadius: "3px",
        paddingX: 24,
        paddingY: 17,
        marginTop: 18,
      }}
    >
      <Text
        sx={{
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "22px",
          color: "rgba(0, 0, 0, 0.85)",
        }}
      >
        {evidenceFile?.title}
      </Text>
      <Text>
        {evidenceFile?.description ||
          (evidenceFile ? "No description." : undefined)}
      </Text>
    </Card>
  );
}

export default function Evidences({ evidences, contract, args }) {
  return (
    <ScrollTo>
      {({ scroll }) => (
        <Box>
          <Flex
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 3,
            }}
          >
            <SubmitEvidenceButton contract={contract} args={args} />
            <Text
              sx={{ color: "primary" }}
              role="button"
              onClick={() =>
                scroll({ y: evidences.length * 190, smooth: true })
              }
            >
              Scroll to 1st Evidence{" "}
              <DownArrow
                sx={{ stroke: "background", path: { fill: "primary" } }}
              />
            </Text>
          </Flex>
          <ScrollArea
            sx={{
              marginBottom: 2,
              marginTop: -3,
              marginX: -4,
              maxHeight: 650,
              overflowY: "scroll",
              paddingTop: 3,
              paddingX: 4,
            }}
          >
            {evidences.map((evidence, index) => (
              <EvidenceItem
                key={evidence.id}
                evidence={evidence}
                index={evidences.length - index}
              />
            ))}
          </ScrollArea>
          <Flex
            sx={{
              justifyContent: "flex-end",
            }}
          >
            <Text
              sx={{ color: "primary" }}
              role="button"
              onClick={() => scroll({ y: 0, smooth: true })}
            >
              Scroll to Last Evidence{" "}
              <UpArrow
                sx={{ stroke: "background", path: { fill: "primary" } }}
              />
            </Text>
          </Flex>
        </Box>
      )}
    </ScrollTo>
  );
}
