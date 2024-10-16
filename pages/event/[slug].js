import Layout from '../../components/Layout'
import { NextSeo } from 'next-seo'
import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { client } from '../../tina/__generated__/client' // Import the Tina client
import { TinaMarkdown } from 'tinacms/dist/rich-text'

export default function Evt({ event }) {
  // console.log('event')
  // console.log(event)
  return (
    <Layout>
      <NextSeo title={event.title} />

      <main>
        <CloudBackgroundOrange />
        <div className='container py-3 position-relative'>
          <h3 className='text-center hero-text text-black-50'>
            <span style={{ color: 'rgb(61, 89, 122)' }}>{event.title}</span>
            <br />
          </h3>
          <div className='row py-3'>
            <div className='col-md-4 text-center p-1'>
              <Image
                alt={event.title}
                src={event.featuredImage}
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
              {event.subtitle && (
                <h4 className='text-start'>{event.subtitle}</h4>
              )}
              {event.subtitle2 && (
                <h4 className='text-start'>{event.subtitle2}</h4>
              )}
              {event.subtitle3 && (
                <h4 className='text-start'>{event.subtitle3}</h4>
              )}
            </div>
          </div>
          <div className='fs-5 my-2 mx-sm-2 mx-md-3'>
            <TinaMarkdown content={event.body} />
          </div>

          {event.registerurl && (
            <div className='d-flex justify-content-center'>
              <button className='btn btn-success text-white' type='button'>
                <Link className='text-white' href={event.registerurl}>
                  Register for Event
                </Link>
              </button>
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}

// Fetch data for a single event using TinaCMS queries
export async function getStaticProps({ params }) {
  try {
    // Use the Tina client to fetch the event by slug
    const { data } = await client.queries.events({
      relativePath: `${params.slug}.mdx`,
    })

    return {
      props: {
        event: data.events, // The event data is directly returned from TinaCMS
      },
    }
  } catch (error) {
    console.error('Error fetching event from TinaCMS:', error)
    return {
      notFound: true,
    }
  }
}

// Fetch all event slugs for static paths
export async function getStaticPaths() {
  // Fetch all articles or posts to generate paths
  const { data } = await client.queries.eventsConnection()

  // Map the data to generate dynamic paths based on slugs
  const paths = data.eventsConnection.edges.map((post) => ({
    params: { slug: post.node._sys.filename }, // Assumes your slug matches the filename
  }))
  // console.log('paths')
  // console.log(paths)

  return {
    paths,
    fallback: false, // Set to true if you want fallback pages for non-pre-rendered paths
  }
}
