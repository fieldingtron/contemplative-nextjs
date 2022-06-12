import Layout from '../components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import profilePic from '../public/img/blue-mandala.png'
import sunsetPic from '../public/img/sunset-clouds.jpg'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <Layout>
      <NextSeo title='Privacy Policy' />

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
            Privacy Policy
          </h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore,
            corporis nihil. Dolore incidunt, harum nihil optio ad accusamus ex
            ea beatae repudiandae aliquam dolores voluptatibus maxime modi, vero
            omnis? Laborum aliquid atque molestias reprehenderit ab quisquam,
            dolores nemo porro quis repellat autem adipisci voluptas
            exercitationem. Facilis hic earum nemo iusto?
          </p>
        </div>
      </main>
    </Layout>
  )
}
