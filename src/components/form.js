import { alpha } from "@theme-ui/color";
import {
  ErrorMessage,
  Formik,
  Field as _Field,
  Form as _Form,
  useField,
} from "formik";
import { createContext, useContext, useMemo } from "react";
import { Box } from "theme-ui";
import { boolean, object, reach, string } from "yup";

import { X } from "../icons";

import Label from "./label";

import { Input, Text } from ".";

const ValidationSchemaContext = createContext();
export default function Form({
  createValidationSchema,
  onSubmit,
  sx,
  children,
  ...rest
}) {
  const validationSchema = useMemo(
    () =>
      object(
        createValidationSchema({
          boolean,
          string() {
            return string().default("");
          },
          object,
        })
      ),
    [createValidationSchema]
  );

  return (
    <ValidationSchemaContext.Provider value={validationSchema}>
      <Formik
        initialValues={validationSchema.default()}
        validationSchema={validationSchema}
        onSubmit={(values, formikBag) =>
          onSubmit(validationSchema.cast(values), formikBag)
        }
        {...rest}
      >
        {(props) => (
          <Box as={_Form} variant="form" sx={sx}>
            {typeof children === "function" ? children(props) : children}
          </Box>
        )}
      </Formik>
    </ValidationSchemaContext.Provider>
  );
}

export function Field({ label, as = Input, name, info, ...rest }) {
  const validationSchema = useContext(ValidationSchemaContext);
  const field = useField(name);
  const [{ onChange }, { touched, error, initialValue }, { setValue }] = field;
  const showError = touched && error;
  return (
    <Label>
      {typeof label === "function" ? label({ field }) : label}
      <Box sx={{ marginTop: 1, position: "relative" }}>
        <_Field
          className={showError ? "error" : undefined}
          as={as}
          sx={{
            ":focus": {
              boxShadow(theme) {
                return `0 0 6px ${alpha("highlight", 0.25)(theme)}`;
              },
            },
          }}
          name={name}
          onChange={(event) => {
            try {
              event.target.value = reach(validationSchema, name).render(
                event.target.value
              );
              onChange(event);
            } catch {
              onChange(event);
            }
          }}
          {...rest}
        />
        {as === Input && showError && (
          <X
            variant="forms.field.error.icon"
            sx={{
              position: "absolute",
              right: 2,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={() => setValue(initialValue)}
          />
        )}
      </Box>
      {info && <Text variant="forms.field.info">{info}</Text>}
      <Text variant="forms.field.error">
        <ErrorMessage name={name} />
        {name === "symbol" && error}{" "}
        {/* Work around field not getting marked as touched */}
      </Text>
    </Label>
  );
}
