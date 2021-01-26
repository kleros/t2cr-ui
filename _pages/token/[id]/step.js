import { Box, Flex } from "@kleros/components";

export default function Step({ number, title, duration }) {
  return (
    <Box>
      <Text>{number}</Text>
      <Flex>
        <Text>{title}</Text>
        <Text>{humanizeDuration(duration)}</Text>
      </Flex>
    </Box>
  );
}
