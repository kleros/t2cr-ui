import { Box, Flex, Text } from "@kleros/components";
import humanizeDuration from "humanize-duration";

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
