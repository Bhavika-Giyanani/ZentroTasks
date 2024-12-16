import * as yup from "yup";

const userValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(/^\S+@\S+\.\S+$/, "Please enter a valid email address"),
  role: yup.string().required("Role is required"),
});

export default userValidationSchema;
