import { Flex, Text } from "@kleros/components";
import humanizeDuration from "humanize-duration";

export default function Step({ number, title, duration }) {
  return (
    <Flex>
      <Flex
        sx={{
          background: "#009aff",
          minWidth: "24px",
          height: "24px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "16px",
        }}
      >
        <Text sx={{ fontWeight: 600, fontSize: "12px", color: "white" }}>
          {number}
        </Text>
      </Flex>

      <Flex sx={{ flexDirection: "column" }}>
        <Text sx={{ fontWeight: 600, fontSize: "14px" }}>{title}</Text>
        <Text
          sx={{
            fontWeight: "normal",
            fontSize: "12px",
            lineHeight: "16px",
            color: "rgba(0, 0, 0, 0.45)",
          }}
        >
          {humanizeDuration(duration)}
        </Text>
      </Flex>
    </Flex>
  );
}
