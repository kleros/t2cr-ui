import { Box, Flex, Text } from "@kleros/components/components";

import { itemStatusEnum } from "../../../data";
import { isResolved } from "../../../utils";

import Alert from "./alert";

const getStatusInfo = ({ status, disputed, appealPeriodStart }) => {
  if (!isResolved(status)) {
    const isRegistration = status === itemStatusEnum.RegistrationRequested;
    const action = isRegistration ? "Registration" : "Removal";
    if (disputed) {
      if (Date.now() > appealPeriodStart * 1000)
        return {
          title: `Jurors ruled in favor of the challenger`,
          description: `The ruling will be enforced if no one appeals.`,
        };

      return {
        title: `${action} Challenged`,
        description: `When there’s a challenge a dispute is created. A random pool of
          specialized jurors is selected to evaluate the case, study the
          evidence, and vote. The side that receives the majority of votes
          wins the dispute and receives the deposit back. After the
          juror's decision, both sides can still appeal if not satisfied
          with the result. It leads to another round with different
          jurors.`,
      };
    }
    return null;
  }
  return null;
};

export default function InfoBox({ item }) {
  const { title, description } = getStatusInfo(item) || {};
  if (!title || !description) return null;

  return <Alert title={title}>{description}</Alert>;
}
