import { gql, useQuery } from "@apollo/client";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Flex, Link } from "theme-ui";

import {
  Button,
  Field,
  FileUpload,
  Form,
  Popup,
  Text,
} from "../../../components";
import { Info } from "../../../icons";
import { useActivity, useContracts, useWallet } from "../../../providers";
import { upload } from "../../../utils";

const submissionQuery = gql`
  query submissionQuery {
    registries(first: 1) {
      sharedStakeMultiplier
      requesterBaseDeposit
      arbitratorExtraData
      registrationMetaEvidenceURI
    }
  }
`;

function SubmissionPopup({ isOpen, close }) {
  const { account } = useWallet();
  const { newTx } = useActivity();
  const { t2cr, arbitrator } = useContracts();
  const { data: submissionData } = useQuery(submissionQuery);

  const registry = (submissionData && submissionData.registries[0]) || {};
  const {
    sharedStakeMultiplier,
    requesterBaseDeposit,
    arbitratorExtraData,
    registrationMetaEvidenceURI,
  } = registry || {};

  const [arbitrationCost, setArbitrationCost] = useState();
  useEffect(() => {
    if (!arbitrator || !arbitratorExtraData) return;
    (async () => {
      setArbitrationCost(await arbitrator.arbitrationCost(arbitratorExtraData));
    })();
  }, [arbitrator, arbitratorExtraData]);

  // totalCost = requesterBaseDeposit + arbitrationCost + feeStake
  // feeStake = arbitrationCost * stakeMultiplier
  // We divide the fee stake by 10000 because the stake multiplier is given in
  // basis points.
  const totalCost = useMemo(() => {
    if (!arbitrationCost || !requesterBaseDeposit || !sharedStakeMultiplier)
      return;

    const { BigNumber } = ethers;
    const MULTIPLIER_DIVISOR = BigNumber.from(10000); // Basis points.
    return arbitrationCost
      .add(
        arbitrationCost
          .mul(BigNumber.from(sharedStakeMultiplier))
          .div(MULTIPLIER_DIVISOR)
      )
      .add(BigNumber.from(requesterBaseDeposit));
  }, [arbitrationCost, requesterBaseDeposit, sharedStakeMultiplier]);

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
        <Text variant="popupTitle">Submit Token</Text>
      </Flex>
      <Form
        createValidationSchema={useCallback(
          ({ string }) => ({
            name: string()
              .max(50, "Must be 50 characters or less.")
              .required("Required"),
            ticker: string()
              .min(2, "Must be more than 2 characters long.")
              .max(7, "Must be less than 10 characters long.")
              .required("Required"),
            address: string()
              .max(42, "Must be 42 characters.")
              .min(42, "Must be 42 characters.")
              .required("Required"),
          }),
          []
        )}
        validate={({ symbol }) => {
          if (!symbol)
            return {
              symbol: "Required",
            };
          return {};
        }}
        onSubmit={async ({ name, ticker, address, symbol }) => {
          try {
            const { pathname: symbolMultihash } = await upload(
              symbol.name,
              symbol.content
            );
            const tx = await t2cr.requestStatusChange(
              name,
              ticker,
              address,
              symbolMultihash,
              { from: account, value: totalCost.toString() }
            );
            newTx(tx);
            close();
          } catch (err) {
            console.error("Error submitting tx", err);
          }
        }}
      >
        {({ isSubmitting, handleSubmit, setSubmitting, errors }) => (
          <Flex sx={{ flexDirection: "column" }}>
            <Field
              name="name"
              label="Name"
              placeholder="The token name (e.g. Wrapped Ether)."
            />
            <Field
              name="ticker"
              label="Ticker"
              placeholder="The token ticker (e.g. WETH)."
            />
            <Field
              name="address"
              label="Address"
              placeholder="e.g. 0x93ED3FBe21207Ec2E8f2d3c3de6e058Cb73Bc04d"
            />
            <Field
              as={FileUpload}
              name="symbol"
              label="Upload the token logo"
              accept="image/png, image/jpeg"
              maxSize={1}
              photo
              error={errors.symbol}
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
                Important: Make sure the logo is a high-resolution PNG with
                transparent background (Max size: 1Mb).
              </Text>
            </Flex>
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
              <Text sx={{ fontSize: "14px" }}>Submission deposit required</Text>
              <Text sx={{ fontSize: "24px", fontWeight: 600 }}>
                {totalCost &&
                  `${Number(formatEther(totalCost)).toFixed(3)} ETH`}
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
                  The Token must follow the{" "}
                  <Link
                    href={`${process.env.REACT_APP_IPFS_GATEWAY}${registrationMetaEvidenceURI}`}
                  >
                    Criteria
                  </Link>
                  . Tokens that do not follow the criteria risk being challenged
                  and removed. Make sure you read and understand the criteria
                  before proceeding. The deposit required is reimbursed if the
                  token is registered, the deposit is lost if the token is
                  removed.
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
                Submit
              </Button>
            </Flex>
          </Flex>
        )}
      </Form>
    </Popup>
  );
}

export default SubmissionPopup;
