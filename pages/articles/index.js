import Layout from '../../components/Layout'
import Image from 'next/image'
import sunsetPic from '../../public/img/sunset-clouds.jpg'
import ArticleSummary from '../../components/ArticleSummary'

export default function Articles({ articles }) {
  // console.log('data received')
  // console.log({ events })
  console.log('first article received')
  console.log(articles[0])
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

        <div className='container py-3'>
          <h1 className='text-center hero-text text-black-50 animate__animated animate__shakeX'>
            Articles
          </h1>

          {articles.map((article) => (
            <ArticleSummary article={article.node} key={article.node.id} />
          ))}
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
        articles {
          edges {
            node {
              id
              uri
              excerpt
              title
              date
              featuredImage {
                node {
                  sourceUrl
                  altText
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
  console.log('data here')
  console.log(json.data)
  console.log('edges here')
  console.log(json.data.articles.edges)

  return {
    props: {
      articles: json.data.articles.edges,
    },
  }
}
