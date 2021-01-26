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
