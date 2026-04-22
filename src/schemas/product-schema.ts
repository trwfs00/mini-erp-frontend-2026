import * as yup from "yup";

export const productSchema = yup.object().shape({
  sku: yup.string().required("SKU is required"),
  name: yup.string().required("Product name is required"),
  category_id: yup.string().required("Category is required"),
  cost_price: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .required("Cost price is required")
    .min(0, "Cost price must be 0 or greater"),
  selling_price: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .required("Selling price is required")
    .min(0, "Selling price must be 0 or greater")
    .test(
      "is-greater-than-cost",
      "Selling price should not be less than cost",
      function (value) {
        const { cost_price } = this.parent;
        if (value === undefined || cost_price === undefined) return true;
        return value >= cost_price;
      }
    ),
  unit: yup.string().required("Unit is required"),
  min_stock: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .required("Minimum stock is required")
    .min(0, "Must be 0 or greater"),
});

export type ProductFormValues = yup.InferType<typeof productSchema>;
