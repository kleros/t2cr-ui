import { createEnum } from "@kleros/components";
import { Check, Pending, X } from "@kleros/icons";

export const itemStatusEnum = createEnum(
  [
    [
      "None",
      {
        kebabCase: undefined,
        startCase: "All",
        query: { where: { status_not: "Absent" } },
      },
    ],
    [
      "RegistrationRequested",
      {
        Icon: Pending,
        query: { where: { status: "RegistrationRequested" } },
      },
    ],
    [
      "ClearingRequested",
      {
        Icon: Pending,
        query: { where: { status: "ClearingRequested" } },
      },
    ],
    [
      "ChallengedRegistration",
      {
        Icon: Pending,
        query: { where: { status: "RegistrationRequested", disputed: true } },
      },
    ],
    [
      "ChallengedRemoval",
      {
        Icon: Pending,
        query: { where: { status: "ClearingRequested", disputed: true } },
      },
    ],
    [
      "Registered",
      {
        Icon: Check,
        query: { where: { status: "Registered" } },
      },
    ],
    [
      "Absent",
      {
        Icon: X,
        query: { where: { status: "Absent" } },
        accentColor: "#6c6c6c",
      },
    ],
    [
      "Crowdfunding",
      {
        Icon: X,
        query: {
          where: {
            appealPeriodStart_gt: "0",
            appealPeriodEnd_gt: Math.floor(Date.now() / 1000).toString(),
          },
        },
        accentColor: "#4d00b4",
      },
    ],
  ],
  ({ status, disputed, appealPeriodStart, appealPeriodEnd }) => {
    const currentTime = Date.now() / 1000;
    if (currentTime > appealPeriodStart && currentTime < appealPeriodEnd)
      return itemStatusEnum.Crowdfunding;
    if (disputed) {
      if (status === itemStatusEnum.RegistrationRequested.key)
        return itemStatusEnum.ChallengedRegistration;
      return itemStatusEnum.ChallengedRemoval;
    }
    switch (status) {
      case itemStatusEnum.Registered.key:
        return itemStatusEnum.Registered;
      case itemStatusEnum.RegistrationRequested.key:
        return itemStatusEnum.RegistrationRequested;
      case itemStatusEnum.ClearingRequested.key:
        return itemStatusEnum.ClearingRequested;
      case itemStatusEnum.Absent.key:
        return itemStatusEnum.Absent;
      default:
        throw new Error("Unknown status");
    }
  }
);

export const queryEnums = { status: itemStatusEnum };
