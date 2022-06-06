import Layout from '../../components/Layout'
import Event from '../../components/Event'
import Image from 'next/image'
import sunsetPic from '../../public/img/sunset-clouds.jpg'

export default function Evt({ event }) {
  //console.log(' eventz received')
  //console.log(event)

  return (
    <Layout>
      <main>
        <Image
          src={sunsetPic}
          className='overlayz'
          alt='Sunset Cloud Background'
          layout='fill'
        />

        <div className='container py-3 position-relative'>
          <h3 className='text-center hero-text text-black-50'>
            <span style={{ color: 'rgb(61, 89, 122)' }}>{event.title}</span>
            <br />
          </h3>
          <div className='row py-3'>
            <div className='col-md-4 text-center p-1'>
              <Image
                alt={event.title}
                src={event.featuredImage.node.sourceUrl}
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
              <h4 className='text-start'>{event.title}</h4>
              {event.requiredData.subtitle && (
                <h4 className='text-start'>{event.requiredData.subtitle}</h4>
              )}
              {event.requiredData.subtitle2 && (
                <h4 className='text-start'>{event.requiredData.subtitle2}</h4>
              )}
              {event.requiredData.subtitle3 && (
                <h4 className='text-start'>{event.requiredData.subtitle3}</h4>
              )}
            </div>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: event.content }}
            className='fs-5 my-2 mx-sm-2 mx-md-3'
          />
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  //console.log(params)
  //console.log('here are parameters')
  const { API_URL } = process.env
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `

      {
        event(id: "${params.slug}", idType: SLUG) {
          id
          slug
          title
          uri
          requiredData {
            subtitle
            subtitle2
            subtitle3
            presenter
            registerurl
          }
          content
          featuredImage {
            node {
              altText
              sourceUrl
            }
          }
        }
      }
      
                `,
    }),
  })

  const json = await response.json()
  //console.log('data here')
  //console.log(json.data)
  // console.log('edges here')
  // console.log(json.data.events.edges)

  return {
    props: {
      event: json.data.event,
    },
  }
}

export async function getStaticPaths() {
  const { API_URL } = process.env
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      query eventz {
        events {
          edges {
            node {
              uri
              title
              date
              slug
            }
          }
        }
      }            
                `,
    }),
  })

  const posts = await response.json()
  console.log('data here')
  console.log(posts.data.events.edges)
  // console.log('edges here')
  // console.log(json.data.events.edges)

  // Get the paths we want to pre-render based on posts
  const paths = posts.data.events.edges.map((post) => ({
    params: { slug: post.node.slug },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }

  return {
    props: {
      events: json.data.events.edges,
    },
  }
}
