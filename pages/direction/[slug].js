import Layout from '../../components/Layout'
import { NextSeo } from 'next-seo'
import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'
import Image from 'next/legacy/image'
import { client } from '../../tina/__generated__/client' // Adjust path if needed
import { TinaMarkdown } from 'tinacms/dist/rich-text'

export default function Direction({ data }) {
  console.log('Client:', client)

  if (!data) {
    return <p>Data not available.</p> // Handle missing data gracefully
  }

  return (
    <Layout>
      <NextSeo title={data.title || 'Untitled'} />
      <main>
        <CloudBackgroundOrange />

        <div className='container py-3 position-relative'>
          <h3 className='text-center hero-text text-black-50'>
            {data.title || 'Untitled'}
          </h3>

          <div className='text-center'>
            <Image
              alt={data.title || 'Image'}
              src={data.featuredImage || '/default-image.png'} // Provide a fallback image
              height={200}
              width={200}
              objectFit='cover'
              objectPosition='center'
              quality={100}
              className='rounded-circle img-fluid'
            />
          </div>

          {/* Uncomment if needed */}
          {/* <div
            dangerouslySetInnerHTML={{ __html: data.content || '' }}
            className='fs-5 my-2 mx-sm-2 mx-md-3'
          /> */}
          <TinaMarkdown content={data.body} />
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  console.log('Params:', params)

  try {
    const { data } = await client.queries.direction({
      relativePath: `${params.slug}.mdx`, // Ensure correct slug-to-path mapping
    })

    if (!data || !data.direction) {
      console.warn('No data found for slug:', params.slug)
      console.log(data)
      return { notFound: true } // Return 404 if data is missing
    }

    return {
      props: {
        data: JSON.parse(JSON.stringify(data.direction)), // Handle serialization issues
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { notFound: true } // Fallback to 404 if there's an error
  }
}

export async function getStaticPaths() {
  console.log('Fetching paths...')

  try {
    const { data } = await client.queries.directionConnection()

    const paths = data.directionConnection.edges.map((post) => ({
      params: { slug: post.node._sys.filename.replace('.mdx', '') },
    }))

    return {
      paths,
      fallback: false, // Adjust fallback mode as needed
    }
  } catch (error) {
    console.error('Error fetching paths:', error)
    return { paths: [], fallback: false } // Handle errors gracefully
  }
}
