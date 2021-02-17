// import { alpha } from "@theme-ui/color";
// import {
//   ErrorMessage,
//   Formik,
//   Field as _Field,
//   Form as _Form,
//   useField,
// } from "formik";
// import prettyNum from "pretty-num";
// import { createContext, useContext, useMemo } from "react";
// import { Box } from "theme-ui";
// import { boolean, object, reach, string } from "yup";

// import { X } from "../icons";

// import Label from "./label";

// import { useWeb3 } from ".";
// import { Input, Text } from ".";

// function ETH(...args) {
//   string.apply(this, args);
//   this.withMutation(() => {
//     this.transform((value) => {
//       if (!value) return this.default();
//       if (this.isType(value) || typeof value !== "string") return value;
//       const [units, decimals] = (/[Ee]/.test(value)
//         ? prettyNum(value)
//         : value
//       ).split(".");
//       value = `${units[0] === "-" ? 0 : units}${
//         decimals ? `.${decimals.slice(0, 18)}` : ""
//       }`;
//       const bn = Web3.utils.toBN(Web3.utils.toWei(value));
//       bn.originalString = value;
//       return bn;
//     });
//   });
// }
// ETH.prototype = Object.create(string.prototype, {
//   constructor: {
//     value: ETH,
//     configurable: true,
//     enumerable: false,
//     writable: true,
//   },
// });
// ETH.prototype._typeCheck = (value) => Web3.utils.isBN(value);
// ETH.prototype.render = function (value) {
//   value = this.cast(value);
//   return this.isType(value) && value.originalString;
// };

// function File(...args) {
//   return object.apply(this, args);
// }
// File.prototype = Object.create(object.prototype, {
//   constructor: {
//     value: File,
//     configurable: true,
//     enumerable: false,
//     writable: true,
//   },
// });
// File.prototype._typeCheck = (value) => value?.toString() === "[object File]";

// const ValidationSchemaContext = createContext();
// export default function Form({
//   createValidationSchema,
//   onSubmit,
//   sx,
//   children,
//   ...rest
// }) {
//   const { web3 } = useWeb3();
//   const validationSchema = useMemo(
//     () =>
//       object(
//         createValidationSchema({
//           boolean,
//           eth() {
//             const initialValue = Web3.utils.toBN("");
//             initialValue.toString = () => "";
//             initialValue.originalString = "";
//             return new ETH().default(initialValue);
//           },
//           file() {
//             return new File().nullable();
//           },
//           string() {
//             return string().default("");
//           },
//           web3,
//         })
//       ),
//     [createValidationSchema, web3]
//   );

//   return (
//     <ValidationSchemaContext.Provider value={validationSchema}>
//       <Formik
//         initialValues={validationSchema.default()}
//         validationSchema={validationSchema}
//         onSubmit={(values, formikBag) =>
//           onSubmit(validationSchema.cast(values), formikBag)
//         }
//         {...rest}
//       >
//         {(props) => (
//           <Box as={_Form} variant="form" sx={sx}>
//             {typeof children === "function" ? children(props) : children}
//           </Box>
//         )}
//       </Formik>
//     </ValidationSchemaContext.Provider>
//   );
// }

// export function Field({ label, as = Input, name, info, ...rest }) {
//   const validationSchema = useContext(ValidationSchemaContext);
//   const field = useField(name);
//   const [{ onChange }, { touched, error, initialValue }, { setValue }] = field;
//   const showError = touched && error;
//   return (
//     <Label>
//       {typeof label === "function" ? label({ field }) : label}
//       <Box sx={{ marginTop: 1, position: "relative" }}>
//         <_Field
//           className={showError ? "error" : undefined}
//           as={as}
//           sx={{
//             ":focus": {
//               boxShadow(theme) {
//                 return `0 0 6px ${alpha("highlight", 0.25)(theme)}`;
//               },
//             },
//           }}
//           name={name}
//           onChange={(event) => {
//             try {
//               event.target.value = reach(validationSchema, name).render(
//                 event.target.value
//               );
//               onChange(event);
//             } catch {
//               onChange(event);
//             }
//           }}
//           {...rest}
//         />
//         {as === Input && showError && (
//           <X
//             variant="forms.field.error.icon"
//             sx={{
//               position: "absolute",
//               right: 2,
//               top: "50%",
//               transform: "translateY(-50%)",
//             }}
//             onClick={() => setValue(initialValue)}
//           />
//         )}
//       </Box>
//       {info && <Text variant="forms.field.info">{info}</Text>}
//       <Text variant="forms.field.error">
//         <ErrorMessage name={name} />
//       </Text>
//     </Label>
//   );
// }

export default Form = function () {
  return null;
};