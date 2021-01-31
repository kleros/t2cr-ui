import { Card, Flex, Text } from "@kleros/components/components";

export default function DisputeInfo({ label, icon, value }) {
  return (
    <Flex>
      <Text>{label}</Text>
      <Card>
        {icon}
        {value}
      </Card>
    </Flex>
  );
}
