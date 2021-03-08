import { BigNumber } from "ethers";
import {
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { Box, Flex, Progress } from "theme-ui";

import { useWallet } from "../providers";
import { chainIdToEtherscanName, truncateEthAddr } from "../utils";

import Card from "./card";
import Grid from "./grid";
import Identicon from "./identicon";
import Text from "./text";
import TimeAgo from "./time-ago";

import { Alert, Button, Link } from ".";

function AppealTabPanelCard({
  address,
  label,
  cost,
  paidFees,
  hasPaid,
  deadline,
  reward,
}) {
  const { chainId } = useWallet();
  const card = (
    <Card
      sx={{ minWidth: 480 }}
      header={
        <>
          <Identicon address={address} />
          <Box sx={{ marginLeft: 2 }}>
            <Link
              href={`https://${chainIdToEtherscanName[chainId]}etherscan.io/address/${address}`}
            >
              {truncateEthAddr(address)}
            </Link>
            <Text>{label}</Text>
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
        {cost && `0 of 0 ETH`}
      </Text>
      <Progress
        sx={{
          borderRadius: 30,
          color: "success",
          height: 8,
          marginBottom: 1,
        }}
        value={paidFees}
        max={cost?.toString()}
      />
      <Text sx={{ marginBottom: 3 }}>
        {hasPaid
          ? "Fully funded."
          : deadline &&
            (deadline.eq(BigNumber.from(0)) ? (
              "Previous round is still in progress."
            ) : (
              <TimeAgo datetime={deadline * 1000} />
            ))}
      </Text>
      <Alert title="For Contributors">
        {reward &&
          `If this side wins, you get back your contribution and a ${reward}%
        reward.`}
      </Alert>
    </Card>
  );
  if (
    !hasPaid &&
    cost &&
    deadline &&
    !deadline.eq(BigNumber.from(0)) &&
    deadline.lt(BigNumber.from(Math.floor(Date.now() / 1000)))
  )
    return <Button>Fund</Button>;
  return card;
}

export default function Appeal({
  sharedStakeMultiplier,
  winnerStakeMultiplier,
  loserStakeMultiplier,
  hasPaidRequester,
  hasPaidChallenger,
  amountPaidRequester,
  amountPaidChallenger,
  requester,
  challenger,
}) {
  sharedStakeMultiplier = BigNumber.from(sharedStakeMultiplier);
  winnerStakeMultiplier = BigNumber.from(winnerStakeMultiplier);
  loserStakeMultiplier = BigNumber.from(loserStakeMultiplier);
  const divisor = BigNumber.from(10000);
  const hundred = BigNumber.from(100);
  const undecided = {
    label: "Previous round undecided.",
    reward: sharedStakeMultiplier.mul(hundred).div(sharedStakeMultiplier),
  };
  const winner = {
    label: "Previous round winner.",
    reward: loserStakeMultiplier.mul(hundred).div(winnerStakeMultiplier),
  };
  const loser = {
    label: "Previous round loser.",
    reward: winnerStakeMultiplier.mul(hundred).div(loserStakeMultiplier),
  };

  const appealCost = BigNumber.from(1);
  if (appealCost) {
    undecided.cost = appealCost.add(
      appealCost.mul(sharedStakeMultiplier).div(divisor)
    );
    winner.cost = appealCost.add(
      appealCost.mul(winnerStakeMultiplier).div(divisor)
    );
    loser.cost = appealCost.add(
      appealCost.mul(loserStakeMultiplier).div(divisor)
    );
  }

  const appealPeriod = {
    start: BigNumber.from(0),
    end: BigNumber.from(0),
  };

  if (appealPeriod) {
    undecided.deadline = appealPeriod.end;
    winner.deadline = appealPeriod.end;
    loser.deadline = appealPeriod.start.add(
      appealPeriod.end.sub(appealPeriod.start).div(BigNumber.from(2))
    );
  }

  const currentRuling = 0;
  const shareTitle = `Crowdfunding Appeal Fees`;
  return (
    <>
      <Text sx={{ marginBottom: 2 }}>
        Help fund a side’s appeal fees to win part of the other side’s deposit
        when your side ultimately wins. If only one side manages to fund their
        fees, it automatically wins.
      </Text>
      <Grid sx={{ marginBottom: 3 }} gap={2} columns={[1, 1, 1, 2]}>
        <AppealTabPanelCard
          address={requester}
          paidFees={amountPaidRequester}
          hasPaid={hasPaidRequester}
        />
        <AppealTabPanelCard
          address={challenger}
          paidFees={amountPaidChallenger}
          hasPaid={hasPaidChallenger}
        />
      </Grid>
      <Flex sx={{ justifyContent: "center" }}>
        <RedditShareButton url={location.href} title={shareTitle}>
          <RedditIcon size={32} />
        </RedditShareButton>
        <TelegramShareButton url={location.href} title={shareTitle}>
          <TelegramIcon size={32} />
        </TelegramShareButton>
        <TwitterShareButton
          url={location.href}
          title={shareTitle}
          via="Kleros_io"
          hashtags={["kleros", "appeals"]}
        >
          <TwitterIcon size={32} />
        </TwitterShareButton>
      </Flex>
    </>
  );
}
