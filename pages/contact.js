import React from 'react'
import CloudBackgroundOrange from '../components/CloudBackgroundOrange'
import Layout from '../components/Layout'
import axios from 'axios'
import EmailSent from '../components/EmailSent'
import { useForm } from 'react-hook-form'
import { NextSeo } from 'next-seo'

export default function ContactPage() {
  const [response, setResponse] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const submitForm = async (data) => {
    console.log('Form Data:', data)

    const EMAIL_FROM = process.env.NEXT_PUBLIC_EMAIL_URL

    if (!EMAIL_FROM) {
      console.error(
        'NEXT_PUBLIC_EMAIL_URL is not defined in environment variables.'
      )
      return
    }

    setResponse(false)

    try {
      // Convert form data to FormData format
      const formData = new FormData()
      formData.append('_wpcf7', '90') // Replace '1234' with your actual CF7 form ID
      formData.append('_wpcf7_unit_tag', '6ff1822') // The provided unit tag
      formData.append('your-name', data['your-name'])
      formData.append('your-email', data['your-email'])
      formData.append('your-message', data['your-message'])

      // Send POST request
      await axios.post(EMAIL_FROM, formData)
      setResponse(true)
    } catch (error) {
      console.error(
        'Error submitting the form:',
        error.response?.data || error.message
      )
    }
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
                          placeholder='Name'
                          {...register('your-name', {
                            required: true,
                            minLength: 3,
                          })}
                        />
                      </div>
                      <div className='mb-3'>
                        <input
                          id='email-2'
                          className='form-control'
                          type='email'
                          placeholder='Email'
                          {...register('your-email', { required: true })}
                        />
                      </div>
                      <div className='mb-3'>
                        <textarea
                          id='message-2'
                          className='form-control'
                          rows={6}
                          placeholder='Message'
                          {...register('your-message', {
                            required: true,
                            minLength: 5,
                          })}
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
  )
}
