import Layout from '../../components/Layout'
import moment from 'moment'
import Image from 'next/image'
import sunsetPic from '../../public/img/sunset-clouds.jpg'
import DirectionSummary from '../../components/DirectionSummary'
export default function Direction({ data }) {
  // console.log('data received')
  // console.log({ events })
  //console.log('first event received')
  //const dddd = data[0]
  //console.log(dddd)

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
            Direction
          </h1>

          <ul>
            {data.map((data) => (
              <DirectionSummary key={data.node.id} data={data} />
            ))}
          </ul>
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  const { API_URL } = process.env
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `


      query datazz {
        direction {
          edges {
            node {
              id
              slug
              uri
              title
              excerpt
              featuredImage {
                node {
                  altText
                  sourceUrl
                }
              }
            }
          }
        }
      }

      
                 
                `,
    }),
  })

  const json = await response.json()
  // console.log('data here')
  // console.log(json.data)
  // console.log('edges here')
  // console.log(json.data.events.edges)

  return {
    props: {
      data: json.data.direction.edges,
    },
  }
}
