const {
  handleContactFormSubmission,
} = require('../../lib/contactFormHandler')

export default async function handler(req, res) {
  const response = await handleContactFormSubmission({
    method: req.method,
    path: req.url,
    headers: req.headers,
    body: req.body,
  })

  res.status(response.statusCode)
  res.setHeader('Content-Type', 'application/json')
  res.send(response.body)
}
