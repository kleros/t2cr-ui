import { createEnum } from "@kleros/components";
import { Check, Pending, X } from "@kleros/icons";

export const tokenStatusEnum = createEnum(
  [
    ["None", { kebabCase: undefined, startCase: "All" }],
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
            appealPeriodStart_gt: 0,
            appealPeriodEnd_lt: Date.now() / 1000,
          },
        },
        accentColor: "#4d00b4",
      },
    ],
  ],
  ({ status, disputed, appealPeriodStart, appealPeriodEnd }) => {
    const currentTime = Date.now() / 1000;
    if (currentTime > appealPeriodStart && currentTime < appealPeriodEnd)
      return tokenStatusEnum.Crowdfunding;
    if (disputed) {
      if (status === tokenStatusEnum.RegistrationRequested.key)
        return tokenStatusEnum.ChallengedRegistration;
      return tokenStatusEnum.ChallengedRemoval;
    }
    switch (status) {
      case tokenStatusEnum.Registered.key:
        return tokenStatusEnum.Registered;
      case tokenStatusEnum.RegistrationRequested.key:
        return tokenStatusEnum.RegistrationRequested;
      case tokenStatusEnum.ClearingRequested.key:
        return tokenStatusEnum.ClearingRequested;
      case tokenStatusEnum.Absent.key:
        return tokenStatusEnum.Absent;
      default:
        throw new Error("Unknown status");
    }
  }
);

export const queryEnums = { status: tokenStatusEnum };
