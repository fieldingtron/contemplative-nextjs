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
    formState: { isSubmitting },
  } = useForm();

  const submitForm = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Send form data to our Netlify function endpoint
      const response = await axios.post("/.netlify/functions/contact-form", {
        // Include form field data
        name: data["your-name"],
        email: data["your-email"],
        message: data["your-message"],
        website: data["website"], // Honeypot field
        formRenderTime, // For timing check
      });

      if (response.data.success) {
        setResponse(true);
        reset(); // Reset form fields on success
      } else {
        setError(
          response.data.message || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        "An error occurred while sending your message. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
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
                          className="form-control"
                          type="text"
                          placeholder="Name"
                          {...register("your-name", {
                            required: true,
                            minLength: 3,
                          })}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          id="email-2"
                          className="form-control"
                          type="email"
                          placeholder="Email"
                          {...register("your-email", { required: true })}
                        />
                      </div>
                      <div className="mb-3">
                        <textarea
                          id="message-2"
                          className="form-control"
                          rows={6}
                          placeholder="Message"
                          {...register("your-message", {
                            required: true,
                            minLength: 5,
                          })}
                        />
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
                          disabled={isSubmitting || isLoading}
                          className="btn btn-secondary btn-lg d-block w-100"
                          type="submit"
                        >
                          {(isSubmitting || isLoading) && (
                            <span className="spinner-border spinner-border-sm mx-2"></span>
                          )}
                          Send!
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
