import Layout from '../components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import profilePic from '../public/img/blue-mandala.png'
import sunsetPic from '../public/img/sunset-clouds.jpg'

export default function Home() {
  return (
    <Layout>
      <main>
        <Image
          src={sunsetPic}
          className='overlayz'
          alt='Sunset Cloud Background'
          layout='fill'
          objectFit='center'
          objectPosition='center'
        />

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
