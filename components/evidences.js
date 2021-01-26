import { Link, NextETHLink, Text } from "@kleros/components/components";
import { DownArrow, File, UpArrow } from "@kleros/icons";
import { Box, Card, Flex } from "theme-ui";

import Identicon from "./identicon";
import ScrollTo, { ScrollArea } from "./scroll-to";

import { Button } from ".";

const intlDateTimeFormat = new Intl.DateTimeFormat("default", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  timeZoneName: "short",
  hour12: false,
});

function EvidenceItem({ evidence: { sender, creationTime }, index }) {
  const evidence = {
    id: "",
    name: "",
    description: "",
    fileURI: "",
  };
  return (
    <Card
      sx={{ marginBottom: 2 }}
      mainSx={{ alignItems: "flex-start", flexDirection: "column" }}
      footer={
        <>
          <Flex sx={{ alignItems: "center" }}>
            <Identicon address={sender} />
            <Box sx={{ marginLeft: 1 }}>
              <Text>
                <Text as="span" sx={{ fontWeight: "bold" }}>
                  #{index}
                </Text>{" "}
                submitted by{" "}
                <NextETHLink address={sender}>{sender}</NextETHLink>
              </Text>
              <Text>
                {intlDateTimeFormat.format(new Date(creationTime * 1000))}
              </Text>
            </Box>
          </Flex>
          {evidence?.fileURI && (
            <Link newTab href={evidence?.fileURI}>
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
        {evidence?.name}
      </Text>
      <Text>
        {evidence?.description || (evidence ? "No description." : undefined)}
      </Text>
    </Card>
  );
}

export default function Evidences({ evidences }) {
  return (
    <ScrollTo>
      {({ scroll }) => (
        <Box sx={{ paddingX: 4 }}>
          <Flex
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 3,
            }}
          >
            <Button>Submit Evidence</Button>
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
