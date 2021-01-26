import { Label } from "theme-ui";

import { itemStatusEnum } from "../data";

export default function Status({ item }) {
  return (
    <>
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
    </>
  );
}
