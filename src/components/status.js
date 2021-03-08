import { Flex, Label } from "theme-ui";

import { itemStatusEnum } from "../data";

import { Link } from ".";

export default function Status({ item, sx }) {
  const { requests } = item;
  const latestRequest = requests[requests.length - 1];
  const { disputed, disputeID } = latestRequest;
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
      {disputed && (
        <Link
          sx={{ marginLeft: "8px" }}
          newTab
          href={`https://court.kleros.io/cases/${disputeID}`}
        >
          # {disputeID}
        </Link>
      )}
    </Flex>
  );
}
