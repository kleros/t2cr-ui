import { Box, Flex } from "theme-ui";

import { Text } from "../../../components";
import { Info } from "../../../icons";

export default function Alert({ type = "info", title, children, sx }) {
  const Icon = { info: Info }[type];
  return (
    <Flex
      variant={`alert.${type}`}
      sx={{
        alignItems: "center",
        border: "1px solid #009aff",
        borderRadius: "3px",
        padding: "24px 16px",
        ...sx,
      }}
    >
      <Icon variant={`alert.${type}.icon`} size={24} />
      <Box sx={{ marginLeft: 2 }}>
        <Text variant={`alert.${type}.title`}>{title}</Text>
        <Text>{children}</Text>
      </Box>
    </Flex>
  );
}
