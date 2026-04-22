import * as yup from "yup";

export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .min(2, "Name must be at least 2 characters"),
  description: yup.string().required("Description is required"),
});

export type CategoryFormValues = yup.InferType<typeof categorySchema>;
