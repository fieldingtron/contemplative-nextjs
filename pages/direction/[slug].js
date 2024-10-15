import Layout from '../../components/Layout'
import { NextSeo } from 'next-seo'
import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'
import Image from 'next/legacy/image'
import { client } from '../../tina/__generated__/client' // Adjust the path if needed

export default function Direction({ data }) {
  //console.log(' articlez received')
  //console.log(article)
  console.log(client)

  return (
    <Layout>
      <NextSeo title={data.title} />
      <main>
        <CloudBackgroundOrange />

        <div className='container py-3 position-relative'>
          <h3 className='text-center hero-text text-black-50'>{data.title}</h3>

          <div className='text-center'>
            <Image
              alt={data.title}
              src={data.featuredImage}
              // layout='fill'\
              height={200}
              width={200}
              objectFit='cover'
              objectPosition='center'
              quality={100}
              className='rounded-circle img-fluid'
            />
          </div>
          {/* <div
            dangerouslySetInnerHTML={{ __html: data.content }}
            className='fs-5 my-2 mx-sm-2 mx-md-3'
          /> */}
        </div>
      </main>
    </Layout>
  )
}
export async function getStaticProps({ params }) {
  console.log('static props -- here are parameters')
  console.log(params)

  // Use TinaCMS pre-generated query to fetch the director's data by slug
  const { data } = await client.queries.director({
    relativePath: `${params.slug}.mdx`, // Ensure your slug matches the relative path format
  })

  console.log('data here')
  console.log(data)

  return {
    props: {
      data: data.director,
    },
  }
}

export async function getStaticPaths() {
  console.log(client)
  // Fetch all slugs to generate static paths
  const { data } = await client.queries.directionConnection()
  const paths = data.directionConnection.edges.map((director) => ({
    params: { slug: data.node._sys.filename.replace('.mdx', '') },
  }))

  return {
    paths,
    fallback: false, // Set to true or 'blocking' if you want to generate pages on demand
  }
}
