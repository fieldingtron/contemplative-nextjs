// Netlify serverless function to handle contact form submissions
// This function uses the Resend API to send emails

const { Resend } = require("resend");

// Handler for Netlify serverless function
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    // Parse the incoming request body
    const data = JSON.parse(event.body);

    // ========== ANTI-SPAM MEASURES ==========

    // 1. Honeypot check - If the honeypot field (website) is filled, reject as spam
    if (data.website && data.website.trim() !== "") {
      console.log("Honeypot field was filled - likely spam");
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

    if (timeSpentOnForm < 3000) {
      // Less than 3 seconds threshold
      console.log(
        "Form submitted too quickly - likely spam",
        timeSpentOnForm + "ms"
      );
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

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Please fill out all required fields",
        }),
      };
    }

    // Initialize Resend with API key from environment variables
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Determine recipient email from environment variables
    // Default to a fallback if not specified
    const recipientEmail =
      process.env.RECIPIENT_EMAIL || "your-email@example.com";

    // Send email using Resend API
    const { data: emailData, error } = await resend.emails.send({
      from: "Contemplative Contact Form <no-reply@your-domain.com>",
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
    });

    if (error) {
      console.error("Error sending email:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Failed to send your message. Please try again later.",
        }),
      };
    }

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Your message has been sent successfully!",
      }),
    };
  } catch (error) {
    console.error("Server error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message:
          "Server error processing your request. Please try again later.",
      }),
    };
  }
};
