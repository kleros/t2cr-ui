import { Accordion } from "@kleros/components/components";
import { graphql } from "relay-hooks";
import { Card } from "theme-ui";

import { Button, Evidence, Evidences, PageContent, useQuery } from "../../../components";
import { itemStatusEnum } from "../../../data";
import { Info } from "../icons";
import { Step } from './step'

const isResolved = (status) =>
  status === itemStatusEnum.Registered || status === itemStatusEnum.Absent;

export default function TokenWithID() {
  const { props } = useQuery();
  const { token } = props || {}

  if (!token) return 'Loading...'

  const { name, ticker, address, symbolMultihash, requests } = token
  const latestRequest = requests[0]
  const { disputed } = latestRequest

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
          <Flex>
            <Info />
            <Box>
              <Text>The Token Registration was Challenged</Text>
              <Text>
                When there’s a challenge a dispute is created. A random pool of
                specialized jurors is selected to evaluate the case, study the
                evidence, and vote. The side that receives the majority of votes
                wins the dispute and receives the deposit back. After the
                juror's decision, both sides can still appeal if not satisfied
                with the result. It leads to another round with different
                jurors.
              </Text>
            </Box>
          </Flex>
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
              <AccordionItem>
                <AccordionItemHeading>Evidence</AccordionItemHeading>
                <AccordionItemPanel>
                  <Evidences evidences={latestRequest.evidences} />
                </AccordionItemPanel>
              </AccordionItem>
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
