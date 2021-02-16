import { Flex } from "theme-ui";

import {
  Button,
  Field,
  FileUpload,
  Form,
  Popup,
  Textarea,
  useArchon,
  useContract,
} from "../../../../components";

const createValidationSchema = ({ string, file }) => ({
  title: string()
    .max(50, "Must be 50 characters or less.")
    .required("Required"),
  description: string()
    .max(300, "Must be 300 characters or less.")
    .required("Required"),
  file: file(),
});

export default function SubmitEvidenceButton({ contract, args }) {
  const { upload } = useArchon();
  const { send } = useContract(contract, "submitEvidence");
  return (
    <Popup trigger={<Button>Submit Evidence</Button>} modal>
      {(close) => (
        <Form
          sx={{ padding: 2 }}
          createValidationSchema={createValidationSchema}
          onSubmit={async ({ name, description, file }) => {
            try {
              let evidence = { name, description };
              if (file)
                evidence.fileURI = (
                  await upload(file.name, file.content)
                ).pathname;
              ({ pathname: evidence } = await upload(
                "evidence.json",
                JSON.stringify(evidence)
              ));
              await send(...args, evidence);
              close();
            } catch (err) {
              console.error("error", err);
            }
          }}
        >
          {({ isSubmitting }) => (
            <>
              <Field
                name="title"
                label="Title"
                placeholder="E.g. The token address is incorrect."
              />
              <Field
                as={Textarea}
                name="description"
                label="Description (Your Arguments)"
                placeholder="E.g. The address includes incorrect values at positions..."
              />
              <Field
                as={FileUpload}
                name="file"
                accept="image/png, image/jpeg, application/pdf"
                maxSize={2}
              />
              <Flex sx={{ justifyContent: "space-between" }}>
                <Button variant="secondary" onClick={close}>
                  Return
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  Submit Evidence
                </Button>
              </Flex>
            </>
          )}
        </Form>
      )}
    </Popup>
  );
}
