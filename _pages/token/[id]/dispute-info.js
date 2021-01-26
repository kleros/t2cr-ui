import { Text } from "@kleros/components";
import { Card } from "theme-ui";

export default function DisputeInfo({ label, icon, value }) {
  return (
    <>
      <Text>{label}</Text>
      <Card>
        {icon}
        {value}
      </Card>
    </>
  );
}
