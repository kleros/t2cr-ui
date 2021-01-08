import { createEnum } from "@kleros/components";
import { Check, Pending, X } from "@kleros/icons";

export const submissionStatusEnum = createEnum(
  [
    ["None", { kebabCase: undefined, startCase: "All" }],
    [
      "RegistrationRequested",
      { Icon: Pending, query: { where: { status: "RegistrationRequested" } } },
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
    ["Registered", { Icon: Check, query: { where: { status: "Registered" } } }],
    [
      "Removed",
      {
        Icon: X,
        query: { where: { status: "Absent" } },
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
      },
    ],
  ],
  ({ status, registered, disputed }) => {
    if (status === submissionStatusEnum.None.key)
      return registered
        ? submissionStatusEnum.Registered
        : submissionStatusEnum.Removed;
    if (disputed)
      return status === submissionStatusEnum.RegistrationRequested.key
        ? submissionStatusEnum.ChallengedRegistration
        : submissionStatusEnum.ChallengedRemoval;
    return submissionStatusEnum[status];
  }
);

export const partyEnum = createEnum(["Requester", "Challenger"], (array) => ({
  [partyEnum.Requester.key]: array[0],
  [partyEnum.Challenger.key]: array[1],
}));

export const queryEnums = { status: submissionStatusEnum };
