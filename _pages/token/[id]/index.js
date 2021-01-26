import { Accordion, VotingHistory } from "@kleros/components/components";
import { graphql } from "relay-hooks";
import { Card } from "theme-ui";

import { Button, Evidences, PageContent, useQuery } from "../../../components";
import { Info } from "../icons";
import InfoBox from "./info-box";
import { Step } from './step'

export default function TokenWithID() {
  const { props } = useQuery();
  const { token } = props || {}

  if (!token) return 'Loading...'

  const { name, ticker, address, symbolMultihash, requests } = token
  const latestRequest = requests[0]
  const { disputed } = latestRequest
  const inAppealPeriod = Date.now()/1000 > appealPeriodStart && Date.now()/1000 < appealPeriodEnd

  return (
    <PageContent>
      <Flex>
        <Text>
          {name} - {ticker}{" "}
        </Text>
        <Status item={token} />
        {!isResolved && !disputed && (
          <Text>{humanizeDuration(3.5 * 24 * 60 * 60 * 1000)}</Text>
        )}
        <Button type="button" variant="primary">
          Submit Token
        </Button>
        {isResolved(status) && (
          <Button type="button" variant="secondary">
            Add Badge
          </Button>
        )}
      </Flex>
      <Box>
        <Image
          width={96}
          src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${symbolMultihash}`}
        />
        <Flex>
          <Text>4 Badges</Text>
          <Link
            href={`https://${
              network ? `${network}.` : ""
            }etherscan.io/token/${address}`}
          >
            <EtherscanLogo />
          </Link>
        </Flex>
      </Box>
      {!isResolved && disputed && (
        <>
          <InfoBox item={item} />
          <Card>
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
