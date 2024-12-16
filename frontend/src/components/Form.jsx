import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useEffect } from "react";

const Form = ({
  formTitle,
  onSubmit,
  fields,
  validationSchema,
  showReset,
  onClose,
  defaultValues,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        overflow: "auto",
      }}
      className="modal"
    >
      {onClose && (
        <span
          className="material-symbols-outlined"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            background: "none",
            border: "none",
            fontSize: "2rem",
            cursor: "pointer",
          }}
        >
          close
        </span>
      )}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="parkinsans-font"
      >
        <h1
          style={{
            marginTop: 0,
            marginLeft: 0,
            fontSize: "2rem",
            marginBottom: 50,
          }}
        >
          {formTitle}
        </h1>
        {fields.map((field) => (
          <div key={field.name} style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              {field.label}
            </label>
            <Controller
              name={field.name}
              control={control}
              render={({ field: inputProps }) => {
                if (field.type === "text" || field.type === "email") {
                  return (
                    <input
                      {...inputProps}
                      type={field.type}
                      style={{ width: "100%" }}
                    />
                  );
                }
                if (field.type === "textarea") {
                  return (
                    <textarea
                      {...inputProps}
                      style={{ width: "100%", minHeight: "100px" }}
                    />
                  );
                }
                if (field.type === "dropdown") {
                  return (
                    <select {...inputProps} style={{ width: "100%" }}>
                      <option value="">Select</option>
                      {field.options.map((option, index) => (
                        <option
                          key={`${option.value}-${index}`}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  );
                }
                return null;
              }}
            />
            {errors[field.name] && (
              <p style={{ color: "red", fontSize: "0.875rem" }}>
                {errors[field.name].message}
              </p>
            )}
          </div>
        ))}
        <div
          className="button-container"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <button
            type="submit"
            style={{ padding: "10px 20px", cursor: "pointer" }}
            className="submit-button"
          >
            Submit
          </button>
          {showReset && (
            <button
              type="button"
              onClick={() => reset()}
              style={{ padding: "10px 20px", cursor: "pointer" }}
              className="reset-button"
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

Form.propTypes = {
  formTitle: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["text", "email", "textarea", "dropdown"])
        .isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  validationSchema: PropTypes.object.isRequired,
  showReset: PropTypes.bool,
  onClose: PropTypes.func,
};

Form.defaultProps = {
  showReset: false,
};

export default Form;
