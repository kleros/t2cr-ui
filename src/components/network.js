import { Flex, Label } from "theme-ui";

import { chainIdToColor, chainIdToName } from "../utils";

export default function Network({ chainId, sx }) {
  return (
    <Flex
      sx={{
        alignItems: "center",
        textTransform: "capitalize",
        fontSize: ["16px", "14px", "12px", "14px"],
        ...sx,
      }}
    >
      <Label
        sx={{
          height: 8,
          width: 8,
          backgroundColor: chainIdToColor(chainId),
          borderRadius: "50%",
          display: "inline-block",
          marginBottom: 0,
          marginRight: 8,
        }}
      />
      {chainIdToName(chainId)}
    </Flex>
  );
}
