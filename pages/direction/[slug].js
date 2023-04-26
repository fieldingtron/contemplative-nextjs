import Layout from '../../components/Layout'
import { NextSeo } from 'next-seo'
import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'
import Image from "next/legacy/image"

export default function Direction({ data }) {
  //console.log(' articlez received')
  //console.log(article)

  return (
    <Layout>
      <NextSeo title={data.title} />
      <main>
        <CloudBackgroundOrange />

        <div className='container py-3 position-relative'>
          <h3 className='text-center hero-text text-black-50'>{data.title}</h3>

          <div className='text-center'>
            <Image
              alt={data.featuredImage.node.altText}
              src={data.featuredImage.node.sourceUrl}
              // layout='fill'\
              height={200}
              width={200}
              objectFit='cover'
              objectPosition='center'
              quality={100}
              className='rounded-circle img-fluid'
            />
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: data.content }}
            className='fs-5 my-2 mx-sm-2 mx-md-3'
          />
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  console.log('static props -- here are parameters')
  console.log(params)

  const { API_URL } = process.env
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `

      query datass {
        director(id: "${params.slug}", idType: SLUG) {
          content
          featuredImage {
            node {
              altText
              sourceUrl
            }
          }
          title
        }
      }
      
                `,
    }),
  })

  const json = await response.json()
  console.log('data here')
  console.log(json.data)
  // console.log('edges here')
  // console.log(json.data.articles.edges)

  return {
    props: {
      data: json.data.director,
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
      query data {
        direction {
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
  console.log('static path data here')
  console.log(posts.data.direction.edges)
  // console.log('edges here')
  // console.log(json.data.articles.edges)

  // Get the paths we want to pre-render based on posts
  const paths = posts.data.direction.edges.map((post) => ({
    params: { slug: post.node.slug },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }

  return {
    props: {
      articles: json.data.articles.edges,
    },
  }
}
