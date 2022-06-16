import React from 'react'
import CloudBackgroundOrange from '../components/CloudBackgroundOrange'
import Layout from '../components/Layout'
import { useState } from 'react'
import { useRouter } from 'next/router'

async function fetchAPI(mailCommand) {
  // Set up some headers to tell the fetch call
  // that this is an application/json type
  const headers = { 'Content-Type': 'application/json' }

  // build out the fetch() call using the API_URL
  // environment variable pulled in at the start
  // Note the merging of the query and variables
  console.log('query')
  const query = mailCommand
  console.log(query)
  const { API_URL } = process.env

  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: ` ${query}`,
    }),
  })

  // error handling work
  const json = await response.json()
  if (json.errors) {
    console.log(json.errors)
    console.log('error details', query)
    throw new Error('Failed to fetch API')
  } else {
    console.log('OK')
    console.log(json)
  }
  return json.data
}

async function sendMail(subject, body) {
  const EMAIL_FROM = process.env.NEXT_PUBLIC_EMAIL_FROM
  const EMAIL_TO = process.env.NEXT_PUBLIC_EMAIL_TO

  const mailCommand = `
	mutation SEND_EMAIL {
		sendEmail(
			input: {to: "${EMAIL_TO}", from: "${EMAIL_FROM}",
      subject: "${subject}", body: "${body.replace(
    /[\r\n]/gm,
    ''
  )}", clientMutationId: "SendMail"}
		) {
			origin
			sent
			message
		}
	}
	
	`

  console.log(mailCommand)

  const data = await fetchAPI(mailCommand)
  return data?.sendEmail
}

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    const emailContent = `
      Message received from <strong>${name}</strong>. 
      Their email address is <strong>${email}</strong>. <br />
      They'd like to know about...
      ${message} `

    const data = await sendMail(
      'New message from website contact form',
      emailContent
    )

    if (data.sent) {
      // email was sent successfully!
      console.log('sent!')
      router.push('/thanks')
    } else {
      console.log('problems sending')
    }
  }

  return (
    <Layout>
      <main>
        <CloudBackgroundOrange />

        <section className='position-relative py-4 py-xl-5'>
          <div className='container position-relative'>
            <div className='row d-flex justify-content-center'>
              <div className='col-md-11 col-lg-10 col-xl-8 col-xxl-8'>
                <h1 className='text-center hero-text text-black-50' />
                <div className='card mb-5'>
                  <div className='card-body p-sm-5'>
                    <h2 className='text-center mb-4 hero-text text-black-50'>
                      Contact Us
                    </h2>
                    <form method='post' onSubmit={handleSubmit}>
                      <div className='mb-3'>
                        <input
                          id='name-2'
                          className='form-control'
                          type='text'
                          name='name'
                          placeholder='Name'
                          minLength={3}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className='mb-3'>
                        <input
                          id='email-2'
                          className='form-control'
                          type='email'
                          name='email'
                          placeholder='Email'
                          required=''
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          minLength={5}
                        />
                      </div>
                      <div className='mb-3'>
                        <textarea
                          id='message-2'
                          className='form-control'
                          name='message'
                          rows={6}
                          placeholder='Message'
                          required=''
                          minLength={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>
                      <div>
                        <button
                          className='btn btn-secondary btn-lg d-block w-100'
                          type='submit'
                        >
                          Send !
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
  )
}
