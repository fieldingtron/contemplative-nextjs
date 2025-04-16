// Netlify serverless function to handle contact form submissions
// This function uses the Resend API to send emails

const { Resend } = require("resend");

// Enhanced logging helper
const logDebugInfo = (message, data = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (Object.keys(data).length > 0) {
    console.log(JSON.stringify(data, null, 2));
  }
};

// Handler for Netlify serverless function
exports.handler = async (event, context) => {
  // Debug log: Function invoked
  logDebugInfo("Contact form function invoked", {
    httpMethod: event.httpMethod,
    path: event.path,
    headers: event.headers,
  });

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    logDebugInfo("Method not allowed", { method: event.httpMethod });
    return {
      statusCode: 405,
      body: JSON.stringify({
        success: false,
        message: "Method not allowed. Please submit the form using POST.",
      }),
    };
  }

  try {
    // Parse the incoming request body
    logDebugInfo("Parsing request body");
    const data = JSON.parse(event.body);
    logDebugInfo("Request data received", {
      hasName: !!data.name,
      hasEmail: !!data.email,
      hasMessage: !!data.message,
      hasHoneypot: !!data.website,
      hasTimestamp: !!data.formRenderTime,
    });

    // ========== ANTI-SPAM MEASURES ==========

    // 1. Honeypot check - If the honeypot field (website) is filled, reject as spam
    if (data.website && data.website.trim() !== "") {
      logDebugInfo("Honeypot field was filled - likely spam");
      // Return success to the bot but don't actually send email
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Form submission received",
        }),
      };
    }

    // 2. Timing check - If form was submitted too quickly, reject as spam
    const { formRenderTime } = data;
    const submissionTime = Date.now();
    const timeSpentOnForm = submissionTime - formRenderTime;

    logDebugInfo("Timing check", {
      formRenderTime,
      submissionTime,
      timeSpentOnForm: `${timeSpentOnForm}ms`,
    });

    if (timeSpentOnForm < 3000) {
      logDebugInfo("Form submitted too quickly - likely spam", {
        timeSpentOnForm: `${timeSpentOnForm}ms`,
      });
      // Return success to the bot but don't actually send email
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Form submission received",
        }),
      };
    }

    // Extract form data
    const { name, email, message } = data;

    // Validate required fields with more specific error messages
    if (!name) {
      logDebugInfo("Validation failed: missing name");
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          field: "name",
          message: "Please provide your name.",
        }),
      };
    }

    if (!email) {
      logDebugInfo("Validation failed: missing email");
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          field: "email",
          message: "Please provide a valid email address.",
        }),
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logDebugInfo("Validation failed: invalid email format", { email });
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          field: "email",
          message:
            "Please enter a valid email address format (example@domain.com).",
        }),
      };
    }

    if (!message) {
      logDebugInfo("Validation failed: missing message");
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          field: "message",
          message: "Please include a message.",
        }),
      };
    }

    if (message.length < 5) {
      logDebugInfo("Validation failed: message too short", {
        length: message.length,
      });
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          field: "message",
          message: "Your message is too short. Please provide more details.",
        }),
      };
    }

    // Check environment variables
    logDebugInfo("Checking environment variables", {
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      hasRecipientEmail: !!process.env.RECIPIENT_EMAIL,
      nodeEnv: process.env.NODE_ENV,
    });

    // Initialize Resend with API key from environment variables
    if (!process.env.RESEND_API_KEY) {
      logDebugInfo("Error: Missing RESEND_API_KEY environment variable");
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message:
            "Server configuration error: Missing API key. Please contact the site administrator.",
        }),
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Determine recipient email from environment variables
    // Default to a fallback if not specified
    const recipientEmail =
      process.env.RECIPIENT_EMAIL || "your-email@example.com";

    // Prepare email parameters
    const fromAddress = "Contemplative Contact Form <no-reply@your-domain.com>";

    const emailParams = {
      from: fromAddress,
      to: recipientEmail,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      // Optional reply-to header with the sender's email
      reply_to: email,
    };

    logDebugInfo("Sending email with Resend", {
      from: fromAddress,
      to: recipientEmail,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
    });

    try {
      // Send email using Resend API
      const { data: emailData, error } = await resend.emails.send(emailParams);

      if (error) {
        logDebugInfo("Error sending email with Resend", error);

        // Provide more specific error messages based on the error type
        if (error.statusCode === 429) {
          return {
            statusCode: 429,
            body: JSON.stringify({
              success: false,
              message:
                "Too many messages sent. Please try again in a few minutes.",
            }),
          };
        } else if (error.statusCode === 401 || error.statusCode === 403) {
          return {
            statusCode: 500,
            body: JSON.stringify({
              success: false,
              message:
                "Authentication error with email service. Please contact the site administrator.",
              debug: error.message,
            }),
          };
        } else {
          return {
            statusCode: 500,
            body: JSON.stringify({
              success: false,
              message:
                "We couldn't send your message at this time. Please try again later or contact us directly via phone.",
              debug: error.message,
            }),
          };
        }
      }

      logDebugInfo("Email sent successfully", { emailId: emailData?.id });

      // Return success response
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message:
            "Thank you! Your message has been sent successfully. We'll get back to you soon.",
        }),
      };
    } catch (resendError) {
      logDebugInfo("Unexpected error during Resend API call", resendError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message:
            "Error connecting to email service. Please try again later.",
          debug: resendError.message,
        }),
      };
    }
  } catch (error) {
    logDebugInfo("Server error:", error);

    // Check for parsing errors specifically
    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message:
            "Invalid request format. Please try submitting the form again.",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message:
          "Something went wrong on our end. Please try again later or contact us directly.",
        debug: error.message,
      }),
    };
  }
};
