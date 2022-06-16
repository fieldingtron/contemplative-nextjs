import Layout from '../components/Layout'
import { NextSeo } from 'next-seo'
import CloudBackgroundOrange from '../components/CloudBackgroundOrange'

export default function Home() {
  return (
    <Layout>
      <NextSeo title='File Not Found' />

      <main>
        <CloudBackgroundOrange />

        <div className='container py-3 px-6'>
          <h1 className='text-center hero-text text-black-50 animate__animated animate__shakeX'>
            404 File Not Found
          </h1>
          <p>Please contact the webmaster</p>
        </div>
      </main>
    </Layout>
  )
}
