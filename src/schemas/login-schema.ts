import * as yup from "yup";

export const loginSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(1, "Please fill in all required fields"),
  password: yup
    .string()
    .required("Password is required")
    .min(1, "Please fill in all required fields"),
  rememberMe: yup.boolean().default(false),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
