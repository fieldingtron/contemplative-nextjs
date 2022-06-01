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
        />

        <div className='container py-3'>
          <h1 className='text-center hero-text text-black-50 animate__animated animate__shakeX'>
            Past Events
          </h1>
          <div className='row py-2'>
            <div className='col-md-4 text-center p-1'>
              <Image
                alt='Retreat Event 1'
                src={profilePic}
                // layout='fill'\
                height={200}
                width={200}
                objectFit='cover'
                objectPosition='center'
                quality={100}
                className='rounded-circle img-fluid'
              />
            </div>
            <div className='col-md-8 d-flex flex-column justify-content-center align-items-center align-items-md-start p-4'>
              <h4 className='text-start'>
                Divine Presence with Fr. Bill Sheehan, OMI
              </h4>
              <h4 className='text-start'>
                Experiencing Incarnation in Your Life
              </h4>
              <h4 className='text-start'>
                Centering Prayer Weekend Retreat
                <br />
              </h4>
              <h4 className='text-start'>
                April 29 - May 1, 2022
                <br />
              </h4>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
