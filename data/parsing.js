import { createEnum } from '@kleros/components';
import { Check, Pending, X } from '@kleros/icons';

export const submissionStatusEnum = createEnum(
  [
    ['None', { kebabCase: undefined, startCase: 'All' }],
    [
      'PendingRegistration',
      { Icon: Pending, query: { where: { status: 'PendingRegistration' } } },
    ],
    [
      'PendingRemoval',
      {
        Icon: Pending,
        query: { where: { status: 'PendingRemoval' } },
      },
    ],
    [
      'ChallengedRegistration',
      {
        Icon: Pending,
        query: { where: { status: 'PendingRegistration', disputed: true } },
      },
    ],
    [
      'ChallengedRemoval',
      {
        Icon: Pending,
        query: { where: { status: 'PendingRemoval', disputed: true } },
      },
    ],
    [
      'Registered',
      { Icon: Check, query: { where: { status: 'None', registered: true } } },
    ],
    [
      'Removed',
      {
        Icon: X,
        query: { where: { status: 'None', registered: false } },
      },
    ],
  ],
  ({ status, registered, disputed }) => {
    if (status === submissionStatusEnum.None.key)
      return registered
        ? submissionStatusEnum.Registered
        : submissionStatusEnum.Removed;
    if (disputed)
      return status === submissionStatusEnum.PendingRegistration.key
        ? submissionStatusEnum.ChallengedRegistration
        : submissionStatusEnum.ChallengedRemoval;
    return submissionStatusEnum[status];
  }
);

export const partyEnum = createEnum(['Requester', 'Challenger'], (array) => ({
  [partyEnum.Requester.key]: array[0],
  [partyEnum.Challenger.key]: array[1],
}));

export const queryEnums = { status: submissionStatusEnum };
