import { gql, useQuery } from "@apollo/client";
import humanizeDuration from "humanize-duration";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Accordion, AccordionItem } from "react-accessible-accordion";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Box, Flex } from "theme-ui";

import {
  AccordionItemHeading,
  AccordionItemPanel,
  Button,
  Image,
  Link,
  PageContent,
  ScrollArea,
  ScrollTo,
  Status,
  Text,
} from "../../components";
import { itemStatusEnum } from "../../data";
import { DownArrow, EtherscanLogo, UpArrow } from "../../icons";
import { useActivity, useContracts, useWallet } from "../../providers";
import { isResolved } from "../../utils";

import EvidenceItem from "./evidence-item";
import { ChallengePopup, EvidencePopup } from "./popups";

const availableAction = (item, timeRemaining) => {
  const status = itemStatusEnum.parse(item).key;
  const { requests } = item;
  const latestRequest = requests[requests.length - 1];
  const { resolutionTime } = latestRequest;

  if (timeRemaining <= 0 && Number(resolutionTime) === 0) return "execute";

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
        type
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
    }
  }
`;

export default function TokenWithID({ network }) {
  const { tokenID } = useParams() || {};
  const { account, walletModalControls } = useWallet();
  const { setWalletModalOpen } = walletModalControls;
  const { t2cr } = useContracts();
  const { newTx } = useActivity();
  const { data, refetch } = useQuery(idQuery, {
    variables: { id: tokenID },
  });
  const { token, registries } = data || {};

  // Event listeners
  useEffect(() => {
    if (!t2cr) return;

    t2cr.on(
      // eslint-disable-next-line new-cap
      t2cr.filters.TokenStatusChange(),
      () =>
        setTimeout(() => {
          refetch();
        }, 5000) // Delay to let subgraph sync.
    );
    t2cr.on(
      // eslint-disable-next-line new-cap
      t2cr.filters.Evidence(),
      () =>
        setTimeout(() => {
          console.info("refetching due to evidence");
          refetch();
        }, 5000) // Delay to let subgraph sync.
    );
    return () => {
      t2cr.removeAllListeners();
    };
  }, [refetch, t2cr]);

  // Token submission modal management.
  const [challengeModalOpen, setChallengeModalOpen] = useState();
  const closeChallengeModal = useCallback(
    () => setChallengeModalOpen(false),
    []
  );
  const onChallengeClick = useCallback(() => {
    if (!account) {
      setWalletModalOpen(true);
      return;
    }
    setChallengeModalOpen(true);
  }, [account, setWalletModalOpen]);

  // Evidence submission modal management.
  const [evidenceModalOpen, setEvidenceModalOpen] = useState();
  const closeEvidenceModal = useCallback(() => setEvidenceModalOpen(false), []);
  const onSubmitEvidenceClick = useCallback(() => {
    if (!account) {
      setWalletModalOpen(true);
      return;
    }
    setEvidenceModalOpen(true);
  }, [account, setWalletModalOpen]);

  // Request execution.
  const onExecuteClick = useCallback(() => {
    if (!t2cr) return;
    if (!account) {
      setWalletModalOpen(true);
      return;
    }

    (async () => {
      const tx = await t2cr.executeRequest(tokenID, { from: account });
      newTx(tx);
    })();
  }, [account, newTx, setWalletModalOpen, t2cr, tokenID]);

  const actionNameToCallback = useMemo(
    () => ({
      "challenge registration": onChallengeClick,
      "challenge removal": onChallengeClick,
      execute: onExecuteClick,
    }),
    [onChallengeClick, onExecuteClick]
  );

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

  const t2crData = registries[0];
  const { challengePeriodDuration } = t2crData || {};

  const latestRequest = requests[requests.length - 1];
  const { disputed, submissionTime, type: requestType } = latestRequest;

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
          {!isResolved(status) && !disputed && timeRemaining > 0 && (
            <Text sx={{ fontSize: ["10px", "12px", "14px"] }}>
              {humanizeDuration(timeRemaining, { largest: 2 })}
            </Text>
          )}
        </Flex>
        <Box>
          {!disputed && (
            <Button
              type="button"
              onClick={
                actionNameToCallback[availableAction(token, timeRemaining)]
              }
              variant="primary"
              sx={{ height: "45px" }}
            >
              {availableAction(token, timeRemaining)}
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
      {requests && (
        <Accordion allowZeroExpanded={false}>
          {requests.map((request, requestIndex) => (
            <AccordionItem
              dangerouslySetExpanded={requestIndex === 0}
              uuid={`request-timeline-uuid-${requestIndex}`}
              key={`request-timeline-${requestIndex}`}
            >
              <AccordionItemHeading>
                Request #{requests.length - requestIndex}
              </AccordionItemHeading>
              <AccordionItemPanel>
                <ScrollTo>
                  {({ scroll }) => (
                    <Box sx={{ paddingX: 4 }}>
                      <Flex
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "64px",
                        }}
                      >
                        {!isResolved(status) && requestIndex === 0 && (
                          <Button
                            type="button"
                            onClick={onSubmitEvidenceClick}
                            variant="primary"
                            sx={{ height: "45px" }}
                          >
                            Submit Evidence
                          </Button>
                        )}
                        <Text
                          sx={{ color: "primary" }}
                          role="button"
                          onClick={() =>
                            scroll({
                              y: request.evidences.length * 190,
                              smooth: true,
                            })
                          }
                        >
                          Scroll to 1st Evidence{" "}
                          <DownArrow
                            sx={{
                              stroke: "background",
                              path: { fill: "primary" },
                            }}
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
                        {request.evidences.map((_evidence, evidenceIndex) => (
                          <EvidenceItem
                            key={_evidence.id}
                            evidence={_evidence}
                            index={request.evidences.length - evidenceIndex}
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
                            sx={{
                              stroke: "background",
                              path: { fill: "primary" },
                            }}
                          />
                        </Text>
                      </Flex>
                    </Box>
                  )}
                </ScrollTo>
              </AccordionItemPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      <ChallengePopup
        isOpen={challengeModalOpen}
        close={closeChallengeModal}
        itemID={tokenID}
        requestType={requestType}
      />
      <EvidencePopup
        isOpen={evidenceModalOpen}
        close={closeEvidenceModal}
        itemID={tokenID}
      />
    </PageContent>
  );
}
