import { Box, Card, Flex } from "theme-ui";

import { Select } from "../../../../components";

export default function VotingHistory() {
  const votes = [{ justification: "I voted this because XYZ." }];
  return (
    <>
      <Flex sx={{ marginBottom: 2 }}>
        <Select items={[1]} value={1} />
        <Box sx={{ flex: 1, marginLeft: 2 }}>
          <Select
            items={["Ruling 1"]}
            value="Ruling 1"
            label="Choose a voting option:"
          />
        </Box>
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
