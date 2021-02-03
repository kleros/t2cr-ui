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
  status === itemStatusEnum.Registered || status === itemStatusEnum.Absent;

export const truncateEthAddr = (ethAddr) => {
  const start = ethAddr.slice(0, 6);
  const end = ethAddr.slice(-4);
  return `${start}...${end}`;
};
