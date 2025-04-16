import React from "react";
import CloudBackgroundOrange from "../components/CloudBackgroundOrange";
import Layout from "../components/Layout";
import axios from "axios";
import EmailSent from "../components/EmailSent";
import { useForm } from "react-hook-form";
import { NextSeo } from "next-seo";

export default function ContactPage() {
  const [response, setResponse] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  // Store form render time to check submission speed (bots submit too quickly)
  const [formRenderTime, setFormRenderTime] = React.useState(0);

  // Set the initial render time when component mounts
  React.useEffect(() => {
    setFormRenderTime(Date.now());
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitForm = async (data) => {
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      console.log("Submitting form to: /.netlify/functions/contact-form");

      // Send form data to our Netlify function endpoint
      const response = await axios.post("/.netlify/functions/contact-form", {
        // Include form field data
        name: data["your-name"],
        email: data["your-email"],
        message: data["your-message"],
        website: data["website"], // Honeypot field
        formRenderTime, // For timing check
      });

      console.log("Response received:", response.data);

      if (response.data.success) {
        setResponse(true);
        reset(); // Reset form fields on success
      } else {
        // Check if we have a field-specific error
        if (response.data.field) {
          setFieldErrors({ [response.data.field]: response.data.message });
        } else {
          setError(
            response.data.message || "Failed to send message. Please try again."
          );
        }

        // Log any debug information if available
        if (response.data.debug) {
          console.error("Debug info:", response.data.debug);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      // Handle axios error responses with status codes
      if (error.response) {
        console.error("Response error data:", error.response.data);
        console.error("Response status:", error.response.status);

        const responseData = error.response.data;

        // Check for field-specific validation errors
        if (responseData.field) {
          setFieldErrors({ [responseData.field]: responseData.message });
        } else {
          setError(
            responseData.message ||
              `Error ${error.response.status}: An error occurred while sending your message.`
          );
        }

        // Log any debug information if available
        if (responseData.debug) {
          console.error("Debug info:", responseData.debug);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        setError(
          "Unable to connect to our server. Please check your internet connection and try again."
        );
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine if a field has an error
  const hasFieldError = (fieldName) => {
    const apiField =
      fieldName === "your-name"
        ? "name"
        : fieldName === "your-email"
        ? "email"
        : fieldName === "your-message"
        ? "message"
        : null;

    return errors[fieldName] || (apiField && fieldErrors[apiField]);
  };

  // Get error message for a specific field
  const getFieldErrorMessage = (fieldName) => {
    const apiField =
      fieldName === "your-name"
        ? "name"
        : fieldName === "your-email"
        ? "email"
        : fieldName === "your-message"
        ? "message"
        : null;

    if (apiField && fieldErrors[apiField]) {
      return fieldErrors[apiField];
    }

    if (errors[fieldName]) {
      if (fieldName === "your-name") {
        return errors[fieldName].type === "required"
          ? "Please enter your name"
          : errors[fieldName].type === "minLength"
          ? "Your name must be at least 3 characters"
          : "Invalid name";
      }
      if (fieldName === "your-email") {
        return errors[fieldName].type === "required"
          ? "Please enter your email address"
          : "Please enter a valid email address";
      }
      if (fieldName === "your-message") {
        return errors[fieldName].type === "required"
          ? "Please enter a message"
          : errors[fieldName].type === "minLength"
          ? "Your message must be at least 5 characters"
          : "Invalid message";
      }
    }

    return null;
  };

  return (
    <Layout>
      <NextSeo title="Contact Page" />
      <main>
        <CloudBackgroundOrange />
        <section className="position-relative py-4 py-xl-5">
          <div className="container position-relative">
            <div className="row d-flex justify-content-center">
              <div className="col-md-11 col-lg-10 col-xl-8 col-xxl-8">
                <h1 className="text-center hero-text text-black-50" />
                <div className="card mb-5">
                  <div className="card-body p-sm-5">
                    <h2 className="text-center mb-4 hero-text text-black-50">
                      Contact Us
                    </h2>
                    {response ? <EmailSent /> : ""}

                    {error && !response && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    <form
                      method="post"
                      onSubmit={handleSubmit(submitForm)}
                      className={response ? "invisible" : ""}
                    >
                      <div className="mb-3">
                        <input
                          id="name-2"
                          className={`form-control ${
                            hasFieldError("your-name") ? "is-invalid" : ""
                          }`}
                          type="text"
                          placeholder="Name"
                          {...register("your-name", {
                            required: true,
                            minLength: 3,
                          })}
                        />
                        {hasFieldError("your-name") && (
                          <div className="invalid-feedback">
                            {getFieldErrorMessage("your-name")}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <input
                          id="email-2"
                          className={`form-control ${
                            hasFieldError("your-email") ? "is-invalid" : ""
                          }`}
                          type="email"
                          placeholder="Email"
                          {...register("your-email", { required: true })}
                        />
                        {hasFieldError("your-email") && (
                          <div className="invalid-feedback">
                            {getFieldErrorMessage("your-email")}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <textarea
                          id="message-2"
                          className={`form-control ${
                            hasFieldError("your-message") ? "is-invalid" : ""
                          }`}
                          rows={6}
                          placeholder="Message"
                          {...register("your-message", {
                            required: true,
                            minLength: 5,
                          })}
                        />
                        {hasFieldError("your-message") && (
                          <div className="invalid-feedback">
                            {getFieldErrorMessage("your-message")}
                          </div>
                        )}
                      </div>
                      {/* ========== ANTI-SPAM MEASURE #1: HONEYPOT FIELD ========== */}
                      {/* This is an invisible field that humans won't see or fill out */}
                      {/* Bots will likely fill it automatically, which we can detect */}
                      <div className="d-none" aria-hidden="true">
                        <input
                          id="website"
                          className="form-control"
                          type="text"
                          autoComplete="off"
                          tabIndex="-1"
                          {...register("website")}
                        />
                      </div>
                      <div>
                        <button
                          disabled={isLoading}
                          className="btn btn-secondary btn-lg d-block w-100"
                          type="submit"
                        >
                          {isLoading && (
                            <span className="spinner-border spinner-border-sm mx-2"></span>
                          )}
                          {isLoading ? "Sending..." : "Send!"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
