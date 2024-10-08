import Layout from '../components/Layout'
import Link from 'next/link'
import CloudBackgroundBlue from '../components/CloudBackgroundBlue'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <Layout>
      <NextSeo description='Online and In Person Retreats' />
      <main className='d-flex justify-content-center align-items-center'>
        <CloudBackgroundBlue />
        <div
          id='centerHero'
          className='d-flex flex-column justify-content-between align-items-center py-3 py-md-5 my-2 my-lg-4 mh-50 class animate__animated animate__bounce'
        >
          <h1 className='text-center hero-text'>contemplative trip</h1>
          <h3 className='text-center hero-text'>
            Spiritual Retreats Online and In-Person
          </h3>
          <div className='d-flex flex-column align-items-center flex-sm-row my-1 onTop100'>
            <Link href='/events' className='btn mx-4 homebut' role='button'>
              Upcoming Events
            </Link>
            <Link href='/events' className='btn homebut' role='button'>
              Past Events
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  )
}
