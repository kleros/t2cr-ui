import {
  Grid,
  NextETHLink,
  Text,
  TimeAgo,
  zeroAddress,
} from "@kleros/components/components";
import {
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { Box, Card, Flex, Progress } from "theme-ui";

import Identicon from "../../../../components/identicon";
import Alert from "../alert";

function AppealTabPanelCard() {
  return (
    <Card
      sx={{ minWidth: 480 }}
      header={
        <>
          <Identicon address={zeroAddress} />
          <Box sx={{ marginLeft: 2 }}>
            <NextETHLink address={zeroAddress}>{zeroAddress}</NextETHLink>
            <Text>Previous round still in progress.</Text>
          </Box>
        </>
      }
      headerSx={{ justifyContent: "flex-start" }}
      mainSx={{ alignItems: "flex-start", flexDirection: "column" }}
    >
      <Text
        sx={{
          fontWeight: "bold",
          marginBottom: 1,
          textAlign: "center",
          width: "100%",
        }}
      >
        38% Funded / 1 ETH of 3.25 ETH
      </Text>
      <Progress
        sx={{
          borderRadius: 30,
          color: "success",
          height: 8,
          marginBottom: 1,
        }}
        value={1}
        max={3.25}
      />
      <Text sx={{ marginBottom: 3 }}>
        <TimeAgo datetime={Date.now() + 3 * 1000} />
      </Text>
      <Alert title="For Contributors">
        If this side wins, you get back your contribution and a 10% reward.
      </Alert>
    </Card>
  );
}

export default function Appeal() {
  return (
    <>
      <Text sx={{ marginBottom: 2 }}>
        In order to appeal the decision, you need to fully fund the crowdfunding
        deposit. The dispute will be sent to the jurors when the full deposit is
        reached. Note that if the previous round loser funds its side, the
        previous round winner should also fully fund its side in order not to
        lose the case.
      </Text>
      <Grid sx={{ marginBottom: 3 }} gap={2} columns={[1, 1, 1, 2]}>
        <AppealTabPanelCard />
        <AppealTabPanelCard />
      </Grid>
      <Flex sx={{ justifyContent: "center" }}>
        <RedditShareButton
          url={location.href}
          title="Crowdfunding appeal fees for PNK"
        >
          <RedditIcon size={32} />
        </RedditShareButton>
        <TelegramShareButton
          url={location.href}
          title="Crowdfunding appeal fees for PNK"
        >
          <TelegramIcon size={32} />
        </TelegramShareButton>
        <TwitterShareButton
          url={location.href}
          title="Crowdfunding appeal fees for PNK"
          via="Kleros_io"
          hashtags={["kleros", "appeals"]}
        >
          <TwitterIcon size={32} />
        </TwitterShareButton>
      </Flex>
    </>
  );
}
