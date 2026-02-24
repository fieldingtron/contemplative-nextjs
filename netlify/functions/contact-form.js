// Netlify serverless function to handle contact form submissions
// This function uses the Resend API to send emails

const { Resend } = require("resend");

const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const MAX_MESSAGE_LENGTH = 3000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;

const spamPatterns = [
  /\bseo\b/i,
  /\bcasino\b/i,
  /\bviagra\b/i,
  /\bcrypto\b/i,
  /\b(?:buy|sell)\s+followers\b/i,
  /\bpayday\s+loan\b/i,
  /\bwork\s+from\s+home\b/i,
  /\bclick\s+here\b/i,
];

// Enhanced logging helper
const logDebugInfo = (message, data = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (Object.keys(data).length > 0) {
    console.log(JSON.stringify(data, null, 2));
  }
};

const getClientIp = (headers = {}) => {
  const forwardedFor = headers["x-forwarded-for"];
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return headers["client-ip"] || "unknown";
};

const isRateLimited = (clientIp) => {
  const now = Date.now();
  const attempts = rateLimitStore.get(clientIp) || [];

  const recentAttempts = attempts.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  recentAttempts.push(now);
  rateLimitStore.set(clientIp, recentAttempts);

  return recentAttempts.length > RATE_LIMIT_MAX_ATTEMPTS;
};

const shouldFlagAsSpam = ({ name, message }) => {
  const combinedText = `${name} ${message}`;
  const urlCount = (combinedText.match(/https?:\/\//gi) || []).length;

  if (urlCount > 2) {
    return true;
  }

  return spamPatterns.some((pattern) => pattern.test(combinedText));
};

// Handler for Netlify serverless function
exports.handler = async (event, context) => {
  // Debug log: Function invoked
  logDebugInfo("Contact form function invoked", {
    httpMethod: event.httpMethod,
    path: event.path,
    clientIp: getClientIp(event.headers),
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
    const clientIp = getClientIp(event.headers);

    if (isRateLimited(clientIp)) {
      logDebugInfo("Rate limit exceeded", { clientIp });
      return {
        statusCode: 429,
        body: JSON.stringify({
          success: false,
          message:
            "Too many form submissions detected. Please wait a few minutes and try again.",
        }),
      };
    }

    logDebugInfo("Request data received", {
      hasName: !!data.name,
      hasEmail: !!data.email,
      hasMessage: !!data.message,
      hasHoneypot: !!data.website,
      hasCompanyHoneypot: !!data.company,
      hasTimestamp: !!data.formRenderTime,
    });

    // ========== ANTI-SPAM MEASURES ==========

    // 1. Honeypot check - If the honeypot field (website) is filled, reject as spam
    if (
      (data.website && data.website.trim() !== "") ||
      (data.company && data.company.trim() !== "")
    ) {
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

    if (
      Number.isNaN(timeSpentOnForm) ||
      timeSpentOnForm < 3000 ||
      timeSpentOnForm > 2 * 60 * 60 * 1000
    ) {
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

    if (name.length > MAX_NAME_LENGTH) {
      logDebugInfo("Validation failed: name too long", {
        length: name.length,
      });
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          field: "name",
          message: "Name is too long.",
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

    if (email.length > MAX_EMAIL_LENGTH) {
      logDebugInfo("Validation failed: email too long", {
        length: email.length,
      });
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          field: "email",
          message: "Email address is too long.",
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

    if (message.length > MAX_MESSAGE_LENGTH) {
      logDebugInfo("Validation failed: message too long", {
        length: message.length,
      });
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          field: "message",
          message:
            "Your message is too long. Please shorten it and try again.",
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

    if (shouldFlagAsSpam({ name, message })) {
      logDebugInfo("Message matched spam heuristics", {
        clientIp,
      });
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Form submission received",
        }),
      };
    }

    // Check environment variables
    logDebugInfo("Checking environment variables", {
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      hasRecipientEmail: !!process.env.RECIPIENT_EMAIL,
      hasFromEmail: !!process.env.FROM_EMAIL,
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

    // Get from address from environment variable with fallback
    const fromAddress =
      process.env.FROM_EMAIL ||
      "Contemplative Contact Form <no-reply@onresend.com>";

    logDebugInfo("Using email configuration", {
      fromAddress,
      recipientEmail,
    });

    const emailParams = {
      from: fromAddress,
      to: recipientEmail,
      subject: `ContemplativeTrip.com Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      text: `
New ContemplativeTrip Form Submission
---------------------------
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      // Optional reply-to header with the sender's email
      reply_to: email,
    };

    logDebugInfo("Sending email with Resend", {
      from: fromAddress,
      to: recipientEmail,
      replyTo: email,
      subject: `Contemplative Trip Contact Form Submission from ${name}`,
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
          message: "Error connecting to email service. Please try again later.",
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
