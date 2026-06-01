const { Resend } = require('resend')

const rateLimitStore = new Map()
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_ATTEMPTS = 5
const MAX_MESSAGE_LENGTH = 3000
const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 254
const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const LOCAL_TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA'

const spamPatterns = [
  /\bseo\b/i,
  /\bcasino\b/i,
  /\bviagra\b/i,
  /\bcrypto\b/i,
  /\b(?:buy|sell)\s+followers\b/i,
  /\bpayday\s+loan\b/i,
  /\bwork\s+from\s+home\b/i,
  /\bclick\s+here\b/i,
]

const logDebugInfo = (message, data = {}) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${message}`)
  if (Object.keys(data).length > 0) {
    console.log(JSON.stringify(data, null, 2))
  }
}

const getHeader = (headers = {}, name) => {
  const lowerName = name.toLowerCase()
  return (
    headers[name] ||
    headers[lowerName] ||
    Object.entries(headers).find(([key]) => key.toLowerCase() === lowerName)?.[1]
  )
}

const getClientIp = (headers = {}) => {
  const forwardedFor = getHeader(headers, 'x-forwarded-for')
  if (forwardedFor) {
    return String(forwardedFor).split(',')[0].trim()
  }

  return getHeader(headers, 'client-ip') || 'unknown'
}

const getRequestHostname = (headers = {}) => {
  const forwardedHost = getHeader(headers, 'x-forwarded-host')
  const host = forwardedHost || getHeader(headers, 'host') || ''
  return String(host).split(':')[0].toLowerCase()
}

const isLocalHostname = (hostname) =>
  ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(hostname)

const isRateLimited = (clientIp) => {
  const now = Date.now()
  const attempts = rateLimitStore.get(clientIp) || []
  const recentAttempts = attempts.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  )

  recentAttempts.push(now)
  rateLimitStore.set(clientIp, recentAttempts)

  return recentAttempts.length > RATE_LIMIT_MAX_ATTEMPTS
}

const shouldFlagAsSpam = ({ name, message }) => {
  const combinedText = `${name} ${message}`
  const urlCount = (combinedText.match(/https?:\/\//gi) || []).length

  if (urlCount > 2) {
    return true
  }

  return spamPatterns.some((pattern) => pattern.test(combinedText))
}

const getTurnstileSecretKey = (hostname) => {
  if (isLocalHostname(hostname)) {
    return LOCAL_TURNSTILE_SECRET_KEY
  }

  return process.env.TURNSTILE_SECRET_KEY
}

const verifyTurnstileToken = async ({ token, clientIp, hostname }) => {
  const secret = getTurnstileSecretKey(hostname)

  if (!secret) {
    return {
      success: false,
      configError: true,
      error: 'Missing TURNSTILE_SECRET_KEY environment variable',
    }
  }

  const params = new URLSearchParams({
    secret,
    response: token,
  })

  if (clientIp && clientIp !== 'unknown') {
    params.set('remoteip', clientIp)
  }

  const verifyResponse = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  const responseText = await verifyResponse.text()

  let responseBody = null
  try {
    responseBody = JSON.parse(responseText)
  } catch (error) {
    responseBody = { raw: responseText }
  }

  if (!verifyResponse.ok) {
    return {
      success: false,
      status: verifyResponse.status,
      error: `Turnstile verification request failed (${verifyResponse.status})`,
      body: responseBody,
    }
  }

  return {
    success: !!responseBody.success,
    errorCodes: responseBody['error-codes'] || [],
    challengeTs: responseBody.challenge_ts,
    hostname: responseBody.hostname,
    body: responseBody,
  }
}

const parseAllowedTurnstileHostnames = () => {
  const rawHostnames = process.env.TURNSTILE_ALLOWED_HOSTNAMES || ''
  return rawHostnames
    .split(',')
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean)
}

const isAllowedTurnstileHostname = (hostname, allowedHostnames) => {
  const normalizedHostname = (hostname || '').toLowerCase().trim()

  return allowedHostnames.some((allowedHostname) => {
    if (allowedHostname.startsWith('*.')) {
      const suffix = allowedHostname.slice(1)
      return normalizedHostname.endsWith(suffix)
    }

    return normalizedHostname === allowedHostname
  })
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const jsonResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
})

const parseBody = (body) => {
  if (!body) {
    return {}
  }

  if (typeof body === 'string') {
    return JSON.parse(body)
  }

  return body
}

async function handleContactFormSubmission({ method, path, headers = {}, body }) {
  logDebugInfo('Contact form function invoked', {
    httpMethod: method,
    path,
    clientIp: getClientIp(headers),
  })

  if (method !== 'POST') {
    return jsonResponse(405, {
      success: false,
      message: 'Method not allowed. Please submit the form using POST.',
    })
  }

  try {
    const data = parseBody(body)
    const clientIp = getClientIp(headers)
    const requestHostname = getRequestHostname(headers)

    if (isRateLimited(clientIp)) {
      return jsonResponse(429, {
        success: false,
        message:
          'Too many form submissions detected. Please wait a few minutes and try again.',
      })
    }

    logDebugInfo('Request data received', {
      hasName: !!data.name,
      hasEmail: !!data.email,
      hasMessage: !!data.message,
      hasTurnstileToken: !!data.turnstileToken,
      hasHoneypot: !!data.website,
      hasCompanyHoneypot: !!data.company,
      hasTimestamp: !!data.formRenderTime,
      requestHostname,
    })

    if (
      (data.website && data.website.trim() !== '') ||
      (data.company && data.company.trim() !== '')
    ) {
      return jsonResponse(200, {
        success: true,
        message: 'Form submission received',
      })
    }

    const { formRenderTime } = data
    const submissionTime = Date.now()
    const timeSpentOnForm = submissionTime - formRenderTime

    if (
      Number.isNaN(timeSpentOnForm) ||
      timeSpentOnForm < 3000 ||
      timeSpentOnForm > 2 * 60 * 60 * 1000
    ) {
      return jsonResponse(200, {
        success: true,
        message: 'Form submission received',
      })
    }

    if (!data.turnstileToken) {
      return jsonResponse(400, {
        success: false,
        field: 'turnstile',
        message: 'Please complete the captcha challenge.',
      })
    }

    const turnstileVerification = await verifyTurnstileToken({
      token: data.turnstileToken,
      clientIp,
      hostname: requestHostname,
    })

    if (!turnstileVerification.success) {
      logDebugInfo('Turnstile verification failed', turnstileVerification)

      if (turnstileVerification.configError) {
        return jsonResponse(500, {
          success: false,
          message: 'Server configuration error: Missing Turnstile secret key.',
        })
      }

      return jsonResponse(400, {
        success: false,
        field: 'turnstile',
        message: 'Captcha verification failed. Please try again.',
        debug: turnstileVerification.errorCodes,
      })
    }

    const allowedTurnstileHostnames = parseAllowedTurnstileHostnames()
    const verifiedHostname = (turnstileVerification.hostname || '')
      .toLowerCase()
      .trim()

    if (
      !isLocalHostname(requestHostname) &&
      allowedTurnstileHostnames.length > 0 &&
      !isAllowedTurnstileHostname(
        verifiedHostname,
        allowedTurnstileHostnames
      )
    ) {
      return jsonResponse(400, {
        success: false,
        field: 'turnstile',
        message: 'Captcha validation failed for this hostname.',
      })
    }

    const name = String(data.name || '').trim()
    const email = String(data.email || '').trim()
    const message = String(data.message || '').trim()

    if (!name) {
      return jsonResponse(400, {
        success: false,
        field: 'name',
        message: 'Please provide your name.',
      })
    }

    if (name.length > MAX_NAME_LENGTH) {
      return jsonResponse(400, {
        success: false,
        field: 'name',
        message: 'Name is too long.',
      })
    }

    if (!email) {
      return jsonResponse(400, {
        success: false,
        field: 'email',
        message: 'Please provide a valid email address.',
      })
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return jsonResponse(400, {
        success: false,
        field: 'email',
        message: 'Email address is too long.',
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return jsonResponse(400, {
        success: false,
        field: 'email',
        message:
          'Please enter a valid email address format (example@domain.com).',
      })
    }

    if (!message) {
      return jsonResponse(400, {
        success: false,
        field: 'message',
        message: 'Please include a message.',
      })
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return jsonResponse(400, {
        success: false,
        field: 'message',
        message: 'Your message is too long. Please shorten it and try again.',
      })
    }

    if (message.length < 5) {
      return jsonResponse(400, {
        success: false,
        field: 'message',
        message: 'Your message is too short. Please provide more details.',
      })
    }

    if (shouldFlagAsSpam({ name, message })) {
      return jsonResponse(200, {
        success: true,
        message: 'Form submission received',
      })
    }

    if (!process.env.RESEND_API_KEY) {
      return jsonResponse(500, {
        success: false,
        message:
          'Server configuration error: Missing API key. Please contact the site administrator.',
      })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const recipientEmail =
      process.env.RECIPIENT_EMAIL || 'your-email@example.com'
    const fromAddress =
      process.env.FROM_EMAIL ||
      'Contemplative Contact Form <no-reply@onresend.com>'

    const emailParams = {
      from: fromAddress,
      to: recipientEmail,
      subject: `ContemplativeTrip.com Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
      text: `
New ContemplativeTrip Form Submission
---------------------------
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      reply_to: email,
    }

    const { data: emailData, error } = await resend.emails.send(emailParams)

    if (error) {
      logDebugInfo('Error sending email with Resend', error)

      if (error.statusCode === 429) {
        return jsonResponse(429, {
          success: false,
          message: 'Too many messages sent. Please try again in a few minutes.',
        })
      }

      if (error.statusCode === 401 || error.statusCode === 403) {
        return jsonResponse(500, {
          success: false,
          message:
            'Authentication error with email service. Please contact the site administrator.',
          debug: error.message,
        })
      }

      return jsonResponse(500, {
        success: false,
        message:
          "We couldn't send your message at this time. Please try again later or contact us directly via phone.",
        debug: error.message,
      })
    }

    logDebugInfo('Email sent successfully', { emailId: emailData?.id })

    return jsonResponse(200, {
      success: true,
      message:
        "Thank you! Your message has been sent successfully. We'll get back to you soon.",
    })
  } catch (error) {
    logDebugInfo('Unexpected contact form error', {
      message: error.message,
    })

    return jsonResponse(500, {
      success: false,
      message: 'Error processing contact form. Please try again later.',
      debug: error.message,
    })
  }
}

module.exports = {
  handleContactFormSubmission,
}
