import { useState } from "react";
import { Box, Card, Flex } from "theme-ui";

import { Select, createUseDataloaders, useWeb3 } from "../../../../components";

const {
  getRulingTitles: useRulingTitles,
  getVotes: useVotes,
} = createUseDataloaders({
  async getRulingTitles(
    {
      archon: {
        arbitrable: { getDispute, getMetaEvidence },
      },
    },
    arbitrableContractAddress,
    arbitratorContractAddress,
    disputeID
  ) {
    const { metaEvidenceID } = await getDispute(
      arbitrableContractAddress,
      arbitratorContractAddress,
      disputeID
    );
    const metaEvidence = await getMetaEvidence(
      arbitrableContractAddress,
      metaEvidenceID,
      {
        scriptParameters: {
          arbitrableContractAddress,
          arbitratorContractAddress,
          disputeID,
        },
        strictHashes: true,
      }
    );
    return metaEvidence.metaEvidenceJSON.rulingOptions.titles;
  },
  async getVotes({ web3 }, arbitrator, disputeID, appeal) {
    const klerosLiquid = web3.contracts.klerosLiquid.clone();
    klerosLiquid.options.address = arbitrator;
    const justifications = await fetch(
      process.env.NEXT_PUBLIC_VOTE_JUSTIFICATIONS,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: { network: web3.ETHNet.name, disputeID, appeal },
        }),
      }
    ).then((res) => res.json());
    return Promise.all(
      justifications.payload.justifications.Items.map(
        async ({
          voteID: { N: voteID },
          justification: { S: justification },
        }) => ({
          ruling: Number(
            (
              await klerosLiquid.methods
                .getVote(disputeID, appeal, voteID)
                .call()
            ).choice
          ),
          justification,
        })
      )
    );
  },
});
function VotingHistoryPanel({
  arbitrable,
  arbitrator,
  challenge: { disputeID, numberOfRounds },
}) {
  const [round, setRound] = useState(0);
  const [ruling, setRuling] = useState(0);

  const getRulingTitles = useRulingTitles();
  const rulingTitles =
    arbitrable && getRulingTitles(arbitrable, arbitrator, disputeID);

  const { web3 } = useWeb3();
  const getVotes = useVotes();

  const votes =
    web3.contracts?.klerosLiquid &&
    web3.ETHNet?.name &&
    getVotes(arbitrator, disputeID, round)?.filter(
      (vote) => vote.ruling === ruling
    );

  return (
    <>
      <Flex sx={{ marginBottom: 2, flexDirection: ["column", "row", "row"] }}>
        <Flex sx={{ alignItems: "center" }}>
          Choose a round:{" "}
          <Select
            items={[...new Array(numberOfRounds)].map((_, index) => index)}
            onChange={(value) => setRound(value)}
            value={round}
            label="Choose a round:"
            sx={{ marginLeft: [0, "12px", "12px"] }}
          />
        </Flex>
        {rulingTitles && (
          <Flex
            sx={{
              alignItems: "center",
              marginLeft: [0, "12px", "12px"],
              marginTop: ["12px", 0, 0],
            }}
          >
            Voting Option:
            <Box sx={{ flex: 1, marginLeft: 2 }}>
              <Select
                items={rulingTitles}
                onChange={(value) => setRuling(rulingTitles.indexOf(value))}
                value={rulingTitles[ruling]}
                label="Choose a voting option:"
              />
            </Box>
          </Flex>
        )}
      </Flex>
      {votes && votes.length === 0
        ? "No Votes"
        : votes?.map((vote, index) => (
            <Card
              key={index}
              header={`Justification #${index + 1}`}
              headerSx={{ fontWeight: "bold" }}
            >
              {vote.justification}
            </Card>
          ))}
    </>
  );
}
export default function VotingHistory({ challenge, arbitrable, arbitrator }) {
  return (
    <VotingHistoryPanel
      arbitrable={arbitrable}
      arbitrator={arbitrator}
      challenge={challenge}
    />
  );
}
