const {
  handleContactFormSubmission,
} = require('../../lib/contactFormHandler')

exports.handler = async (event) => {
  const response = await handleContactFormSubmission({
    method: event.httpMethod,
    path: event.path,
    headers: event.headers,
    body: event.body,
  })

  return {
    statusCode: response.statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: response.body,
  }
}
