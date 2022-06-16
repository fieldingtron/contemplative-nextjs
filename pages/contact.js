import React from 'react'
import CloudBackgroundOrange from '../components/CloudBackgroundOrange'
import Layout from '../components/Layout'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { FormData } from 'formdata-node'
import axios from 'axios'
import EmailSent from '../components/EmailSent'
import { useForm } from 'react-hook-form'
import { NextSeo } from 'next-seo'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const [response, setResponse] = useState(false)

  const { handleSubmit, formState } = useForm()
  const { isSubmitting } = formState

  function submitForm(data, evt) {
    evt.preventDefault()
    // console.log('data', data)
    // console.log('evt', evt)

    const formData = new FormData(evt.target)
    const EMAIL_FROM = process.env.NEXT_PUBLIC_EMAIL_URL

    setResponse(false)
    //console.log('start')

    return new Promise((resolve) => {
      axios.post(EMAIL_FROM, formData).then((res) => {
        //console.log('promised response')
        //console.log(res)
        setResponse(true)
        resolve()
      })
    })
  }

  return (
    <Layout>
      <NextSeo title='Contact Page' />
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
                    {response ? <EmailSent /> : ''}

                    <form
                      method='post'
                      onSubmit={handleSubmit(submitForm)}
                      className={response ? 'invisible' : ''}
                    >
                      <div className='mb-3'>
                        <input
                          id='name-2'
                          className='form-control'
                          type='text'
                          name='your-name'
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
                          name='your-email'
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
                          name='your-message'
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
                          disabled={isSubmitting}
                          className='btn btn-secondary btn-lg d-block w-100'
                          type='submit'
                        >
                          {isSubmitting && (
                            <span className='spinner-border spinner-border-sm mx-2'></span>
                          )}
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
