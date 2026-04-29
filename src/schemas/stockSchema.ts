import * as yup from "yup";

export const stockTransactionSchema = yup.object().shape({
  product_id: yup.string().required("Please select a product"),
  type: yup
    .string()
    .oneOf(["IN", "OUT", "ADJUST"])
    .required("Transaction type is required"),
  quantity: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .required("Quantity is required")
    .when("type", {
      is: "ADJUST",
      then: (schema) => schema.notOneOf([0], "Quantity must not be 0"),
      otherwise: (schema) => schema.min(1, "Quantity must be at least 1"),
    }),
  note: yup.string(),
  reason: yup.string().when("type", {
    is: "ADJUST",
    then: (schema) =>
      schema.required("Reason is required for stock adjustment"),
    otherwise: (schema) => schema.optional(),
  }),
});

export type StockTransactionFormValues = yup.InferType<
  typeof stockTransactionSchema
>;
