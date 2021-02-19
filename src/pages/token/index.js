import { gql, useQuery } from "@apollo/client";
import humanizeDuration from "humanize-duration";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Box, Card, Divider, Flex } from "theme-ui";

import {
  Button,
  Image,
  Link,
  PageContent,
  Status,
  Text,
} from "../../components";
import { itemStatusEnum } from "../../data";
import { EtherscanLogo } from "../../icons";
import { isResolved } from "../../utils";

import InfoBox from "./info-box";
import Step from "./step";

const availableAction = (item) => {
  const status = itemStatusEnum.parse(item).key;

  switch (status) {
    case itemStatusEnum.Registered.key:
      return "remove";
    case itemStatusEnum.RegistrationRequested.key:
      return "challenge registration";
    case itemStatusEnum.ClearingRequested.key:
      return "challenge removal";
    case itemStatusEnum.Absent.key:
      return "resubmit";
    default:
      return "";
  }
};

const idQuery = gql`
  query IdQuery($id: ID!) {
    token(id: $id) {
      id
      status
      name
      ticker
      address
      symbolMultihash
      disputed
      appealPeriodStart
      appealPeriodEnd
      requests {
        id
        submissionTime
        result
        resolutionTime
        numberOfRounds
        requester
        arbitrator
        challenger
        disputed
        disputeID
        rounds {
          id
          amountPaidRequester
          amountPaidChallenger
          hasPaidRequester
          hasPaidChallenger
          appealTime
          ruling
          rulingTime
          appealPeriodStart
          appealPeriodEnd
        }
        evidences {
          id
          submitter
          submissionTime
          evidenceURI
        }
      }
    }
    registries(first: 1) {
      challengePeriodDuration
      sharedStakeMultiplier
      winnerStakeMultiplier
      loserStakeMultiplier
      arbitratorExtraData
    }
  }
`;

export default function TokenWithID({ network }) {
  const { tokenID } = useParams() || {};
  const { data } = useQuery(idQuery, {
    variables: { id: tokenID },
  });
  const { token, registries } = data || {};
  // const { web3 } = useWeb3();
  // const getDisputeInfo = useDisputeInfo();

  if (!token || !registries)
    return (
      <Flex
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "500px",
        }}
      >
        <BarLoader loading size={150} color="#4d00b4" />
      </Flex>
    );

  const { name, ticker, address, symbolMultihash, requests, status } = token;

  const t2cr = registries[0];
  const { challengePeriodDuration } = t2cr || {};

  const latestRequest = requests[requests.length - 1];
  const { disputed, submissionTime } = latestRequest;

  const submissionTimeMili = submissionTime * 1000;
  const challengePeriodDurationMili = challengePeriodDuration * 1000;
  const challengePeriodEndMili =
    submissionTimeMili + challengePeriodDurationMili;
  const timeRemaining = challengePeriodEndMili - Date.now();

  return (
    <PageContent>
      <Flex
        sx={{
          marginTop: "70px",
          marginBottom: "8px",
          justifyContent: "space-between",
        }}
      >
        <Flex sx={{ alignItems: "center" }}>
          <Text
            sx={{
              fontWeight: 600,
              textTransform: "capitalize",
              fontSize: ["12px", "14px", "16px"],
              display: "flex",
            }}
          >
            {name.toLowerCase()} - {ticker}
          </Text>
          <Status
            item={token}
            sx={{ marginLeft: "32px", marginRight: "8px" }}
          />
          {!isResolved(status) && !disputed && (
            <Text sx={{ fontSize: ["10px", "12px", "14px"] }}>
              {humanizeDuration(timeRemaining, { largest: 2 })}
            </Text>
          )}
        </Flex>
        <Box>
          {!disputed && (
            <Button type="button" variant="primary" sx={{ height: "45px" }}>
              {availableAction(token)}
            </Button>
          )}
          {isResolved(status) && (
            <Button
              type="button"
              variant="secondary"
              sx={{ marginLeft: "24px", height: "45px" }}
            >
              Add Badge
            </Button>
          )}
        </Box>
      </Flex>
      <Flex
        sx={{
          marginY: "24px",
          background: "linear-gradient(180deg, #fbf9fe 0%, #fff 100%)",
          width: "100%",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: "37px",
        }}
      >
        <Image
          width={96}
          height={96}
          sx={{ objectFit: "contain" }}
          src={`${process.env.REACT_APP_IPFS_GATEWAY}${symbolMultihash}`}
        />
        <Flex
          sx={{
            width: "100%",
            paddingX: "24px",
            paddingBottom: "15px",
            justifyContent: "space-between",
          }}
        >
          <Text>4 Badges</Text>
          <Link
            href={`https://${
              network ? `${network}.` : ""
            }etherscan.io/token/${address}`}
          >
            <EtherscanLogo />
          </Link>
        </Flex>
      </Flex>
      {!isResolved(status) && disputed && (
        <>
          <InfoBox sx={{ marginY: "24px" }} item={token} />
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
      )}
    </PageContent>
  );
}
