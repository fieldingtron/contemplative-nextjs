import Layout from '../components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import profilePic from '../public/img/blue-mandala.png'
import sunsetPic from '../public/img/sunset-clouds.jpg'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <Layout>
      <NextSeo title='File Not Found' />

      <main>
        <Image
          src={sunsetPic}
          className='overlayz'
          alt='Sunset Cloud Background'
          layout='fill'
          objectFit='center'
          objectPosition='center'
          priority
        />

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
