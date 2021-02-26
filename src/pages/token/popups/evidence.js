import { useCallback } from "react";
import { Flex } from "theme-ui";

import {
  Button,
  Field,
  FileUpload,
  Form,
  Popup,
  Text,
  Textarea,
} from "../../../components";
import { Info } from "../../../icons";
import { useActivity, useContracts, useWallet } from "../../../providers";
import { upload } from "../../../utils";

function EvidencePopup({ isOpen, close, itemID }) {
  const { account } = useWallet();
  const { t2cr } = useContracts();
  const { newTx } = useActivity();

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
        <Text variant="popupTitle">Submit New Evidence</Text>
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
            let fileURI;
            if (attachment)
              fileURI = (await upload(attachment.name, attachment.content))
                .pathname;

            const evidence = { name: title, description };
            if (fileURI) evidence.fileURI = fileURI;

            const { pathname: evidenceURI } = await upload(
              "evidence.json",
              JSON.stringify(evidence)
            );

            const tx = await t2cr.submitEvidence(itemID, evidenceURI, {
              from: account,
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
                disabled={!account}
                onClick={() => {
                  if (isSubmitting) return;
                  setSubmitting(true);
                  handleSubmit();
                }}
              >
                Submit Evidence
              </Button>
            </Flex>
          </Flex>
        )}
      </Form>
    </Popup>
  );
}

export default EvidencePopup;
