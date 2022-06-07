import Layout from '../../components/Layout'
import Image from 'next/image'
import sunsetPic from '../../public/img/sunset-clouds.jpg'
import moment from 'moment'

export default function Art({ article }) {
  //console.log(' articlez received')
  //console.log(article)

  const { API_URL } = process.env

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
            <span style={{ color: 'rgb(61, 89, 122)' }}>{article.title}</span>
            <br />
          </h3>

          <h6 className='mx-sm-2 mx-md-3 fs-4 my-2 text-center'>
            Date: {moment(article.date).format('MMM Do YYYY')}
          </h6>

          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
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
        article(id: "${params.slug}", idType: SLUG) {
          id
          slug
          title
          uri
          date
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
  // console.log(json.data.articles.edges)

  return {
    props: {
      article: json.data.article,
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
      query articlez {
        articles {
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
  console.log(posts.data.articles.edges)
  // console.log('edges here')
  // console.log(json.data.articles.edges)

  // Get the paths we want to pre-render based on posts
  const paths = posts.data.articles.edges.map((post) => ({
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
