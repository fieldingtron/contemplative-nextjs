import Layout from '../../components/Layout'
import ArticleSummary from '../../components/ArticleSummary'
import { NextSeo } from 'next-seo'

import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'
import { client } from '../../tina/__generated__/client'

export default function Articles({ articles }) {
  // console.log('data received')
  // console.log({ events })
  //console.log('first article received')
  console.log(articles)
  //console.log(event)
  return (
    <Layout>
      <NextSeo title='List of Articles' />
      <main>
        <CloudBackgroundOrange />

        <div className='container py-3'>
          <h1 className='text-center hero-text text-black-50 animate__animated animate__shakeX'>
            Articles
          </h1>
          {/* <ul>
            {articles.map((article) => (
              <li key={article.id}>
                <h2>{article.title}</h2>
                <p>{article.subtitle}</p>
                <time>{new Date(article.date).toLocaleDateString()}</time>
              </li>
            ))}
          </ul> */}

          {articles.map((article) => (
            <ArticleSummary article={article} key={article.id} />
          ))}
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  const { data } = await client.queries.articleConnection()

  return {
    props: {
      articles: data.articleConnection.edges.map((edge) => edge.node),
    },
  }
}
