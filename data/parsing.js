import lodashKebabCase from "lodash.kebabcase";
import lodashStartCase from "lodash.startcase";

import { Check, Pending, X } from "../icons";

export const zeroAddress = "0x0000000000000000000000000000000000000000";

export const ethereumAddressRegExp = /^0x[\dA-Fa-f]{40}$/;

export const createEnum = (keys, parse) => {
  const _enum = keys.reduce(
    (acc, key, index) => {
      let extra;
      if (Array.isArray(key)) [key, extra] = key;

      const value = {
        key,
        index,
        camelCase: key[0].toLowerCase() + key.slice(1),
        kebabCase: lodashKebabCase(key),
        startCase: lodashStartCase(key),
        ...extra,
      };
      value.color = value.camelCase;
      value.toString = () => value.startCase;

      acc[key] = value;
      acc[index] = value;
      acc[value.camelCase] = value;
      acc[value.kebabCase] = value;
      acc[value.startCase] = value;
      return acc;
    },
    {
      parse:
        parse ||
        ((arrayOrKey) =>
          Array.isArray(arrayOrKey)
            ? arrayOrKey.reduce((acc, key) => {
                const value = _enum[key];
                acc[key] = value;
                acc[value.index] = value;
                acc[value.camelCase] = value;
                acc[value.kebabCase] = value;
                acc[value.startCase] = value;
                return acc;
              }, {})
            : _enum[arrayOrKey]),
    }
  );
  _enum.array = keys.map((_, index) => _enum[index]);
  return _enum;
};

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
