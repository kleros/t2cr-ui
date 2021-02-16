import { Flex, Label } from "theme-ui";

import { itemStatusEnum } from "../data";

export default function Status({ item, sx }) {
  return (
    <Flex
      sx={{
        alignItems: "center",
        fontSize: ["16px", "14px", "12px", "14px"],
        ...sx,
      }}
    >
      <Label
        sx={{
          height: 8,
          width: 8,
          backgroundColor: (theme) =>
            theme.colors[itemStatusEnum.parse(item).camelCase],
          borderRadius: "50%",
          display: "inline-block",
          marginBottom: 0,
          marginRight: 8,
        }}
      />
      {itemStatusEnum.parse(item).startCase}
    </Flex>
  );
}
