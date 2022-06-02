import Layout from '../components/Layout'
import Link from 'next/link'
import cloudPic from '../public/img/blue-clouds.jpeg'
import sunsetPic from '../public/img/sunset-clouds.jpg'

import Image from 'next/image'

export default function Links() {
  return (
    <Layout>
      <main>
        <Image
          src={sunsetPic}
          className='overlayz'
          alt='Sunset Pic Background'
          layout='fill'
          objectFit='center'
          objectPosition='center'
        />
        <div
          id='centerHero'
          className='container py-3 position-relative onTop100'
        >
          <h1 className='text-center hero-text'>Contemplative Path</h1>
          <h3 className='text-center hero-text'>
            Spiritual Retreats Online and In-Person
          </h3>
          <div className='d-flex flex-column align-items-center flex-sm-row my-1 '>
            <Link href='/events'>
              <a className='btn mx-4 homebut' role='button'>
                Upcoming Events
              </a>
            </Link>
            <Link href='/events'>
              <a className='btn homebut' role='button'>
                Past Events
              </a>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  )
}
