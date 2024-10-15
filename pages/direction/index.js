import Layout from '../../components/Layout'
import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'

import DirectionSummary from '../../components/DirectionSummary'
import { NextSeo } from 'next-seo'
import { client } from '../../tina/__generated__/client' // Adjust the path based on your project structure

export default function Direction({ data }) {
  // console.log('data received')
  console.log({ data })

  return (
    <Layout>
      <NextSeo title='Leadership contemplative trip' />
      <main>
        <CloudBackgroundOrange />

        <div className='container py-3'>
          <h1 className='text-center hero-text text-black-50 animate__animated animate__shakeX'>
            Direction
          </h1>
          <ul>
            {data.map((data) => (
              <DirectionSummary key={data.id} data={data} />
            ))}
          </ul>
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  // Use the pre-generated TinaCMS client to fetch the data
  const { data } = await client.queries.directionConnection()
  //console.log(data)

  return {
    props: {
      data: data.directionConnection.edges.map((edge) => edge.node),
    },
  }
}
