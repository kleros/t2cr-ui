import { Divider, Flex } from "theme-ui";

import { Card } from "../../components";

import InfoBox from "./info-box";
import Step from "./step";

function Dispute({ item }) {
  return (
    <>
      <InfoBox sx={{ marginY: "24px" }} item={item} />
      <Card
        sx={{
          alignContent: "center",
          flexDirection: "column",
          boxShadow: "0 6px 24px rgba(77, 0, 180, 0.25)",
          borderRadius: "18px",
          padding: "32px",
          marginY: "24px",
        }}
      >
        <Flex sx={{ flexDirection: "column" }}>
          <Flex
            sx={{
              justifyContent: "space-between",
              marginBottom: "14px",
              alignItems: ["flex-start", "center"],
              flexDirection: ["column", "row"],
            }}
          >
            <Step
              number={1}
              title="Evidence Period"
              duration={3.25 * 24 * 60 * 60 * 1000}
            />
            <Divider
              sx={{
                flexGrow: 1,
                marginTop: 0,
                marginX: "24px",
                marginBottom: "14px",
              }}
            />
            <Step
              number={2}
              title="Voting Period"
              duration={3 * 24 * 60 * 60 * 1000}
            />
            <Divider
              sx={{
                flexGrow: 1,
                marginTop: 0,
                marginX: "24px",
                marginBottom: "14px",
              }}
            />
            <Step
              number={3}
              title="Appeal Period"
              duration={3 * 24 * 60 * 60 * 1000}
            />
          </Flex>
          <Divider
            sx={{
              borderBottom: "2px solid #4d00b4",
              marginY: "14px",
            }}
          />
        </Flex>
      </Card>
    </>
  );
}

export default Dispute;
