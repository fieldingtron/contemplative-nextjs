import Layout from '../components/Layout'
import CloudBackgroundOrange from '../components/CloudBackgroundOrange'
export default function Home() {
  return (
    <Layout>
      <main>
        <CloudBackgroundOrange />

        <div className='container py-3 px-6'>
          <h1 className='text-center hero-text text-black-50 animate__animated animate__shakeX'>
            Email Sent
          </h1>
          <p>Your email has been sent! Thank you!</p>
        </div>
      </main>
    </Layout>
  )
}
