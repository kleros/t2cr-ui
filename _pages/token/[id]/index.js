import humanizeDuration from "humanize-duration";
import { BarLoader } from "react-spinners";
import { graphql } from "relay-hooks";
import { Box, Card, Divider, Flex } from "theme-ui";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  Button,
  Image,
  Link,
  PageContent,
  Status,
  Text,
  createUseDataloaders,
  useQuery,
  useWeb3,
} from "../../../components";
import { itemStatusEnum, useEvidenceFile } from "../../../data";
import { Court, EtherscanLogo, Number, User } from "../../../icons";
import { isResolved } from "../../../utils";

import Appeal from "./appeal";
import DisputeInfo from "./dispute-info";
import Evidences from "./evidences";
import InfoBox from "./info-box";
import Step from "./step";
import VotingHistory from "./voting-history";

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

const { getDisputeInfo: useDisputeInfo } = createUseDataloaders({
  // eslint-disable-next-line require-await
  async getDisputeInfo({ web3 }, arbitrator, disputeID) {
    const klerosLiquid = web3.contracts.klerosLiquid.clone();
    klerosLiquid.options.address = arbitrator;
    return klerosLiquid.methods.getDispute(disputeID).call();
  },
});

export default function TokenWithID({ network }) {
  const { props } = useQuery();
  const { web3 } = useWeb3();
  const { token, registries } = props || {};

  const getDisputeInfo = useDisputeInfo();

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

  const {
    name,
    ticker,
    address,
    symbolMultihash,
    requests,
    appealPeriodStart,
    appealPeriodEnd,
    id,
    status,
  } = token;

  const t2cr = registries[0];
  const {
    challengePeriodDuration,
    sharedStakeMultiplier,
    winnerStakeMultiplier,
    loserStakeMultiplier,
    arbitratorExtraData,
  } = t2cr || {};

  const latestRequest = requests[requests.length - 1];
  const {
    disputed,
    disputeID,
    numberOfRounds,
    arbitrator,
    submissionTime,
    rounds,
    requester,
    challenger,
  } = latestRequest;

  const inAppealPeriod =
    Date.now() / 1000 > appealPeriodStart &&
    Date.now() / 1000 < appealPeriodEnd;

  const submissionTimeMili = submissionTime * 1000;
  const challengePeriodDurationMili = challengePeriodDuration * 1000;
  const challengePeriodEndMili =
    submissionTimeMili + challengePeriodDurationMili;
  const timeRemaining = challengePeriodEndMili - Date.now();

  const disputeInfo =
    web3.contracts?.klerosLiquid &&
    web3.ETHNet?.name &&
    disputed &&
    disputeID &&
    getDisputeInfo(arbitrator, disputeID);

  const jurorCount =
    disputeInfo &&
    disputeInfo.votesLengths[disputeInfo.votesLengths.length - 1];

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
          src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${symbolMultihash}`}
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
              <Flex sx={{ marginY: "14px", justifyContent: "space-between" }}>
                <DisputeInfo
                  sx={{ flexGrow: 1 }}
                  label="Dispute"
                  icon={<Number />}
                  value={latestRequest.disputeID}
                />
                <DisputeInfo
                  sx={{ flexGrow: 3, marginX: 24 }}
                  label="Court"
                  icon={<Court />}
                  value="Curate"
                />
                <DisputeInfo
                  sx={{ flexGrow: 1 }}
                  label="Jurors"
                  icon={<User />}
                  value={jurorCount}
                />
              </Flex>
              <Accordion
                allowMultipleExpanded
                allowZeroExpanded={false}
                sx={{ padding: 0 }}
              >
                {inAppealPeriod && (
                  <AccordionItem>
                    <AccordionItemHeading>Appeal</AccordionItemHeading>
                    <AccordionItemPanel sx={{ padding: 32, margin: 0 }}>
                      <Appeal
                        challenge={{
                          disputeID,
                          numberOfRounds,
                          parties: [requester, challenger],
                          rounds,
                          id,
                        }}
                        arbitrable={web3.contracts?.t2cr?.options?.address}
                        arbitrator={arbitrator}
                        arbitratorExtraData={arbitratorExtraData}
                        sharedStakeMultiplier={sharedStakeMultiplier}
                        winnerStakeMultiplier={winnerStakeMultiplier}
                        loserStakeMultiplier={loserStakeMultiplier}
                        contract="t2cr"
                        args={[id]}
                      />
                    </AccordionItemPanel>
                  </AccordionItem>
                )}
                <AccordionItem>
                  <AccordionItemHeading>Evidence</AccordionItemHeading>
                  <AccordionItemPanel sx={{ padding: 32, margin: 0 }}>
                    <Evidences
                      evidences={latestRequest.evidences}
                      contract="t2cr"
                      args={[id]}
                      useEvidenceFile={useEvidenceFile}
                    />
                  </AccordionItemPanel>
                </AccordionItem>
                {disputed && (
                  <AccordionItem>
                    <AccordionItemHeading>Voting History</AccordionItemHeading>
                    <AccordionItemPanel sx={{ padding: 32, margin: 0 }}>
                      <VotingHistory
                        challenge={{ disputeID, numberOfRounds }}
                        arbitrable={web3.contracts?.t2cr?.options?.address}
                        arbitrator={arbitrator}
                      />
                    </AccordionItemPanel>
                  </AccordionItem>
                )}
              </Accordion>
            </Flex>
          </Card>
        </>
      )}
    </PageContent>
  );
}

export const IdQuery = graphql`
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
