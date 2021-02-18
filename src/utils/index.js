import { itemStatusEnum } from "../data";

export const navigation = [
  {
    to: "/",
    label: "Tokens",
  },
  {
    to: "/badges",
    label: "Badges",
  },
  {
    to: "/criteria",
    label: "Criteria",
  },
  {
    to: "/statistics",
    label: "Statistics",
  },
];

export const isResolved = (status) =>
  status === itemStatusEnum.Registered.key ||
  status === itemStatusEnum.Absent.key;

export const truncateEthAddr = (ethAddr) => {
  const start = ethAddr.slice(0, 6);
  const end = ethAddr.slice(-4);
  return `${start}...${end}`;
};

export const chainIdToName = (chainId) => {
  switch (chainId) {
    case 1:
      return "mainnet";
    case 42:
      return "kovan";
    default:
      throw new Error(`Unknown name for chainId ${chainId}`);
  }
};

export const chainIdToColor = (chainId) => {
  switch (chainId) {
    case 1:
      return "#29b6af";
    case 42:
      return "#9064ff";
    default:
      throw new Error(`Unknown color for chainId ${chainId}`);
  }
};
