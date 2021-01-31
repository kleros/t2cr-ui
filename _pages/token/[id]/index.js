import { Accordion, Text, Flex, Link, Image } from "@kleros/components";
import { EtherscanLogo } from "@kleros/icons/icons";
import { graphql } from "relay-hooks";
import { Card } from "theme-ui";

import {
  Button,
  Evidences,
  PageContent,
  Status,
  useQuery,
} from "../../../components";
import { Info } from "../../../icons";
import { isResolved } from "../../../utils";
import InfoBox from "./info-box";
import Step from "./step";

export default function TokenWithID({ network }) {
  const { props } = useQuery();
  const { token } = props || {};

  if (!token) return "Loading...";

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

  return (
    <PageContent>
      <Flex sx={{ marginTop: "70px", justifyContent: "space-between" }}>
        <Flex>
          <Text
            sx={{
              fontWeight: 600,
              textTransform: "capitalize",
              fontSize: "24px",
            }}
          >
            {name.toLowerCase()} - {ticker}
          </Text>
          <Status item={token} sx={{ marginLeft: "32px" }} />
          {!isResolved && !disputed && (
            <Text>{humanizeDuration(3.5 * 24 * 60 * 60 * 1000)}</Text>
          )}
        </Flex>
        <Button type="button" variant="primary">
          Submit Token
        </Button>
        {isResolved(status) && (
          <Button type="button" variant="secondary">
            Add Badge
          </Button>
        )}
      </Flex>
      <Flex
        sx={{
          marginTop: "37px",
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
      {!isResolved && disputed && (
        <>
          <InfoBox item={item} />
          <Card>
            alignContent: 'center', flexDirection: "column"
            <Flex>
              <Step
                number={1}
                title="Evidence Period"
                duration={3.25 * 24 * 60 * 60 * 1000}
              />
              <Step
                number={2}
                title="Evidence Period"
                duration={3 * 24 * 60 * 60 * 1000}
              />
              <Step
                number={3}
                title="Evidence Period"
                duration={3 * 24 * 60 * 60 * 1000}
              />
            </Flex>
            <Flex>
              <DisputeInfo label="Dispute" icon={<Info />} value={1369} />
              <DisputeInfo label="Court" icon={<Info />} value="Curate" />
              <DisputeInfo label="Jurors" icon={<Info />} value={3} />
            </Flex>
            <Accordion allowMultipleExpanded allowZeroExpanded>
              {inAppealPeriod(
                <AccordionItem>
                  <AccordionItemHeading>Appeal</AccordionItemHeading>
                  <AccordionItemPanel>
                    <Appeal />
                  </AccordionItemPanel>
                </AccordionItem>
              )}
              <AccordionItem>
                <AccordionItemHeading>Evidence</AccordionItemHeading>
                <AccordionItemPanel>
                  <Evidences evidences={latestRequest.evidences} />
                </AccordionItemPanel>
              </AccordionItem>
              {disputed && (
                <AccordionItem>
                  <AccordionItemHeading>Voting History</AccordionItemHeading>
                  <AccordionItemPanel>
                    <VotingHistory />
                  </AccordionItemPanel>
                </AccordionItem>
              )}
            </Accordion>
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
        submissionTime
        result
        resolutionTime
        requester
        challenger
        rounds {
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
          submitter
          submissionTime
          evidenceURI
        }
      }
    }
  }
`;
