import Layout from '../components/Layout'
import { NextSeo } from 'next-seo'
import CloudBackgroundOrange from '../components/CloudBackgroundOrange'

export default function Home() {
  return (
    <Layout>
      <NextSeo title='Privacy Policy' />

      <main>
        <CloudBackgroundOrange />

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
