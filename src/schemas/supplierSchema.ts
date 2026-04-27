import * as yup from "yup";

export const supplierSchema = yup.object().shape({
  name: yup.string().required("Supplier name is required"),
  phone: yup.string().required("Phone number is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  address: yup.string().required("Address is required"),
});

export type SupplierFormValues = yup.InferType<typeof supplierSchema>;
