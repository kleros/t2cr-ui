import { useCallback, useMemo } from "react";

import { Button, Field, Form, Popup, Text, useWeb3 } from "../../../components";

export default function FundButton({
  totalCost,
  totalContribution,
  contract,
  method,
  children,
  args,
}) {
  const amountNeeded = useMemo(() => totalCost.sub(totalContribution), [
    totalCost,
    totalContribution,
  ]);
  const createValidationSchema = useCallback(
    ({ eth, web3: _web3 }) => ({
      contribution: eth()
        .test({
          test(value) {
            if (value.lte(_web3.utils.toBN(0)))
              return this.createError({
                message: `You need to contribute something.`,
              });
            return true;
          },
        })
        .test({
          test(value) {
            if (value.gt(amountNeeded))
              return this.createError({
                message: `There's no need to contribute this much.`,
              });
            return true;
          },
        }),
    }),
    [amountNeeded]
  );
  const { send } = useContract(contract, method);
  const { web3 } = useWeb3();
  const amountNeededString = web3.utils.fromWei(amountNeeded);
  return (
    <Popup
      trigger={
        typeof children === "string" ? (
          <Button
            sx={{
              marginBottom: 1,
              width: "100%",
            }}
          >
            {children}
          </Button>
        ) : (
          children
        )
      }
      modal
    >
      {(close) => (
        <Form
          sx={{ padding: 2, textAlign: "center" }}
          createValidationSchema={createValidationSchema}
          onSubmit={async ({ contribution }) => {
            await send(...args, { value: contribution });
            close();
          }}
        >
          {({ isSubmitting }) => (
            <>
              <Field
                name="contribution"
                label={({ field }) => (
                  <Text>
                    Contribution
                    <Text
                      sx={{ fontWeight: "bold" }}
                      onClick={() => field[2].setValue(amountNeededString)}
                    >
                      (Needed: {amountNeededString})
                    </Text>
                  </Text>
                )}
                type="number"
              />
              <Button type="submit" loading={isSubmitting}>
                Fund
              </Button>
            </>
          )}
        </Form>
      )}
    </Popup>
  );
}
