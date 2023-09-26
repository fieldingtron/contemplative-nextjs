import Layout from '../components/Layout'
import Link from 'next/link'
import CloudBackgroundOrange from '../components/CloudBackgroundOrange'

export default function Links() {
  return (
    <Layout>
      <main>
        <CloudBackgroundOrange />

        <div
          id='centerHero'
          className='container py-3 position-relative onTop100'
        >
          <h1 className='text-center hero-text'>Contemplative Path</h1>
          <h3 className='text-center hero-text'>
            Spiritual Retreats Online and In-Person
          </h3>
          <div className='d-flex flex-column align-items-center flex-sm-row my-1 '>
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
  );
}
