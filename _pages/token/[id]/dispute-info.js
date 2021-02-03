import { Card, Flex, Text } from "@kleros/components/components";

export default function DisputeInfo({ label, icon, value, sx }) {
  return (
    <Flex sx={{ flexDirection: "column", ...sx }}>
      <Text
        sx={{
          fontSize: "14px",
          color: "rgba(0, 0, 0, 0.85)",
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {label}
      </Text>
      <Card
        sx={{
          boxShadow: "0 6px 24px rgba(77, 0, 180, 0.25)",
          borderRadius: "3px",
          paddingY: "8px",
          paddingX: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {icon}
        <Text
          sx={{
            marginLeft: "8px",
            fontWeight: 600,
            fontSize: "16px",
            color: "rgba(0, 0, 0, 0.85)",
          }}
        >
          {value}
        </Text>
      </Card>
    </Flex>
  );
}
