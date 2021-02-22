import { gql, useQuery } from "@apollo/client";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Flex } from "theme-ui";

import {
  Button,
  Field,
  FileUpload,
  Form,
  Link,
  Popup,
  Text,
  Textarea,
} from "../../../components";
import { itemStatusEnum } from "../../../data";
import { Info } from "../../../icons";
import { useActivity, useContracts, useWallet } from "../../../providers";
import { upload } from "../../../utils";

const challengeQuery = gql`
  query challengeQuery {
    registries(first: 1) {
      sharedStakeMultiplier
      challengerBaseDeposit
      arbitratorExtraData
      registrationMetaEvidenceURI
      clearingMetaEvidenceURI
    }
  }
`;

function ChallengePopup({ isOpen, close, requestType, itemID }) {
  const { account } = useWallet();
  const { t2cr, arbitrator } = useContracts();
  const { newTx } = useActivity();

  const { data: challengeData } = useQuery(challengeQuery);

  const registry = (challengeData && challengeData.registries[0]) || {};
  const {
    sharedStakeMultiplier,
    challengerBaseDeposit,
    arbitratorExtraData,
    clearingMetaEvidenceURI,
    registrationMetaEvidenceURI,
  } = registry || {};

  const [arbitrationCost, setArbitrationCost] = useState();
  useEffect(() => {
    if (!arbitrator || !arbitratorExtraData) return;
    (async () => {
      setArbitrationCost(await arbitrator.arbitrationCost(arbitratorExtraData));
    })();
  }, [arbitrator, arbitratorExtraData]);

  // totalCost = challengerBaseDeposit + arbitrationCost + feeStake
  // feeStake = arbitrationCost * stakeMultiplier
  // We divide the fee stake by 10000 because the stake multiplier is given in
  // basis points.
  const totalCost = useMemo(() => {
    if (!arbitrationCost || !challengerBaseDeposit || !sharedStakeMultiplier)
      return;

    const { BigNumber } = ethers;
    const MULTIPLIER_DIVISOR = BigNumber.from(10000); // Basis points.
    return arbitrationCost
      .add(
        arbitrationCost
          .mul(BigNumber.from(sharedStakeMultiplier))
          .div(MULTIPLIER_DIVISOR)
      )
      .add(BigNumber.from(challengerBaseDeposit));
  }, [arbitrationCost, challengerBaseDeposit, sharedStakeMultiplier]);

  const criteriaURI =
    requestType === itemStatusEnum.RegistrationRequested.key
      ? registrationMetaEvidenceURI
      : clearingMetaEvidenceURI;
  const criteriaURL = `${process.env.REACT_APP_IPFS_GATEWAY}${criteriaURI}`;

  return (
    <Popup
      open={isOpen}
      closeOnDocumentClick
      onClose={close}
      overlayStyle={{ background: "rgba(0, 0, 0, 0.25)" }}
      contentStyle={{
        maxWidth: "75%",
      }}
      sx={{
        overflowY: "auto",
        padding: "32px",
        maxHeight: "90vh",
        backgroundColor: "white",
      }}
    >
      <Flex sx={{ justifyContent: "center" }}>
        <Text variant="popupTitle">
          Challenge{" "}
          {requestType === itemStatusEnum.RegistrationRequested.key
            ? "Submission"
            : "Removal"}
        </Text>
      </Flex>
      <Form
        createValidationSchema={useCallback(
          ({ string }) => ({
            title: string()
              .max(50, "Must be 50 characters or less.")
              .required("Required"),
          }),
          []
        )}
        onSubmit={async ({ title, description, attachment }) => {
          try {
            const { pathname: fileURI } = await upload(
              attachment.name,
              attachment.content
            );
            const { pathname: evidenceURI } = await upload(
              "evidence.json",
              JSON.stringify({ fileURI, name: title, description })
            );
            const tx = await t2cr.challengeRequest(itemID, evidenceURI, {
              from: account,
              value: totalCost.toString(),
            });
            newTx(tx);
            close();
          } catch (err) {
            console.error("Error submitting tx", err);
          }
        }}
      >
        {({ isSubmitting, handleSubmit, setSubmitting }) => (
          <Flex sx={{ flexDirection: "column" }}>
            <Flex
              sx={{
                flexDirection: "column",
                backgroundColor: (theme) => theme.colors.accentMuted,
                borderRadius: "3px",
                border: (theme) => `1px solid ${theme.colors.accent}`,
                color: (theme) => theme.colors.accent,
                alignItems: "center",
                padding: "16px",
                marginY: "12px",
              }}
            >
              <Text sx={{ fontSize: "14px" }}>Deposit required</Text>
              <Text sx={{ fontSize: "24px", fontWeight: 600 }}>
                {totalCost &&
                  `${Number(formatEther(totalCost)).toFixed(3)} ETH`}
              </Text>
            </Flex>
            <Field
              name="title"
              label="Reason"
              placeholder="e.g The token address is wrong."
            />
            <Field
              as={Textarea}
              name="description"
              label="Description"
              placeholder="e.g. If you inspect the address on etherscan..."
            />
            <Field
              as={FileUpload}
              name="attachment"
              label="Attachment"
              accept="application/pdf"
              maxSize={5}
            />
            <Flex sx={{ marginY: "16px" }}>
              <Flex
                sx={{
                  minWidth: "24px",
                  paddingTop: "2px",
                }}
              >
                <Info />
              </Flex>
              <Text sx={{ fontSize: "14px", lineHeight: "19px" }}>
                Additionally, you can add an external file in PDF.
              </Text>
            </Flex>
            <Flex
              sx={{
                marginY: "12px",
                alignItems: "center",
                border: (theme) => `1px solid ${theme.colors.primary}`,
                padding: "16px",
              }}
            >
              <Flex
                sx={{
                  minWidth: "24px",
                  paddingTop: "2px",
                }}
              >
                <Info size={24} />
              </Flex>
              <Flex sx={{ flexDirection: "column", marginLeft: "16px" }}>
                <Text
                  sx={{
                    color: (theme) => theme.colors.primary,
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                >
                  Note
                </Text>
                <Text sx={{ fontSize: "14px", lineHeight: "19px" }}>
                  Make sure the request you are challenging violates the{" "}
                  <Link href={criteriaURL}>Criteria</Link>.
                </Text>
              </Flex>
            </Flex>
            <Flex
              sx={{
                justifyContent: "space-between",
                marginTop: "16px",
                marginBottom: "32px",
              }}
            >
              <Button variant="secondary" onClick={close}>
                Return
              </Button>
              <Button
                loading={isSubmitting}
                disabled={!totalCost || !account}
                onClick={() => {
                  if (isSubmitting) return;
                  setSubmitting(true);
                  handleSubmit();
                }}
              >
                Challenge
              </Button>
            </Flex>
          </Flex>
        )}
      </Form>
    </Popup>
  );
}

export default ChallengePopup;
