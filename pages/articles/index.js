import Layout from '../../components/Layout'
import ArticleSummary from '../../components/ArticleSummary'
import fs from 'fs'
import path from 'path'

import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'
import { client } from '../../tina/__generated__/client'

export default function Articles({ articles }) {
  // console.log('data received')
  // console.log({ events })
  //console.log('first article received')
  //console.log(articles)
  //console.log(event)
  return (
    <Layout title='List of Articles'>
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
  const articlesDir = path.join(process.cwd(), 'content', 'articles')
  const files = fs.readdirSync(articlesDir)

  const articles = files
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const fullPath = path.join(articlesDir, filename)
      const raw = fs.readFileSync(fullPath, 'utf8')
      // Extract JSON frontmatter between first two --- lines
      const match = raw.match(/^---\n([\s\S]*?)\n---/) // non-greedy
      let meta = {}
      if (match) {
        try {
          meta = JSON.parse(match[1])
        } catch (e) {
          meta = {}
        }
      }
      const body = raw.replace(/^---[\s\S]*?---\n/, '')
      const excerpt = body.trim().split('\n\n')[0] || ''
      const slug = filename.replace(/\.mdx$/, '')
      return {
        id: `${slug}.mdx`,
        slug,
        title: meta.title || slug,
        date: meta.date || '',
        featuredImage: meta.featuredImage || '/img/blue-mandala.png',
        excerpt,
      }
    })

  return {
    props: {
      articles,
    },
  }
}
