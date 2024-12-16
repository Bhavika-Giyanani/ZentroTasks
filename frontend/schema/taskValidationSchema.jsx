import * as yup from "yup";

const taskValidationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  status: yup.string().required("Status is required"),
  userId: yup.string().required("User is required"),
});

export default taskValidationSchema;
