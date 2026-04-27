import * as yup from "yup";

const poItemSchema = yup.object().shape({
  product_id: yup.string().required("Select product"),
  quantity: yup
    .number()
    .typeError("Qty must be a number")
    .min(1, "Qty > 0")
    .required("Qty > 0"),
  unit_price: yup
    .number()
    .typeError("Price must be a number")
    .min(0, "Price must be >= 0")
    .required(),
});

export const purchaseOrderSchema = yup.object().shape({
  order_number: yup
    .string()
    .required("Please enter order number")
    .trim()
    .min(1, "Please enter order number"),
  supplier_id: yup.string().required("Please select a supplier"),
  items: yup.array().of(poItemSchema).min(1, "Add at least one item"),
});

export type POFormValues = yup.InferType<typeof purchaseOrderSchema>;
