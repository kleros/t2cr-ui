import {
  Accordion,
  Text,
  Flex,
  Link,
  Image,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
} from "@kleros/components";
import { EtherscanLogo } from "@kleros/icons/icons";
import { graphql } from "relay-hooks";
import { Card, Divider } from "theme-ui";
import humanizeDuration from "humanize-duration";
import { BarLoader } from "react-spinners";

import {
  Button,
  Evidences,
  PageContent,
  Status,
  useQuery,
} from "../../../components";
import { Number, Court, User } from "../../../icons";
import { isResolved } from "../../../utils";
import InfoBox from "./info-box";
import Step from "./step";
import DisputeInfo from "./dispute-info";
import Appeal from "./appeal";
import VotingHistory from "./voting-history";
import { itemStatusEnum } from "../../../data";

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
      "";
  }
};

export default function TokenWithID({ network }) {
  const { props } = useQuery();
  const { token } = props || {};  

  if (!token) return (
    <Flex sx={{ 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        minHeight: '400px'
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
  } = token;

  const latestRequest = requests[0];
  const { disputed } = latestRequest;
  const inAppealPeriod =
    Date.now() / 1000 > appealPeriodStart &&
    Date.now() / 1000 < appealPeriodEnd;
  
  const challengePeriodEnd = 3.5 * 24 * 60 * 60 * 1000

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
              {humanizeDuration(challengePeriodEnd)}
            </Text>
          )}
        </Flex>
        {!disputed && (
          <Button type="button" variant="primary">
            {availableAction(token)} Token
          </Button>
        )}
        {isResolved(status) && (
          <Button type="button" variant="secondary">
            Add Badge
          </Button>
        )}
      </Flex>
      <Flex
        sx={{
          marginY: "24px",
          background: "linear-gradient(180deg, #FBF9FE 0%, #FFFFFF 100%)",
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
              boxShadow: "0px 6px 24px rgba(77, 0, 180, 0.25)",
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
                  borderBottom: "2px solid #4D00B4",
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
                  value={3}
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
                      <Appeal />
                    </AccordionItemPanel>
                  </AccordionItem>
                )}
                <AccordionItem>
                  <AccordionItemHeading>Evidence</AccordionItemHeading>
                  <AccordionItemPanel sx={{ padding: 32, margin: 0 }}>
                    <Evidences evidences={latestRequest.evidences} />
                  </AccordionItemPanel>
                </AccordionItem>
                {disputed && (
                  <AccordionItem>
                    <AccordionItemHeading>Voting History</AccordionItemHeading>
                    <AccordionItemPanel sx={{ padding: 32, margin: 0 }}>
                      <VotingHistory />
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
        requester
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
  }
`;
