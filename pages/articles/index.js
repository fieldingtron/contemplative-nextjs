import Layout from '../../components/Layout'
import ArticleSummary from '../../components/ArticleSummary'
import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from '../../lib/frontmatter'

import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'

export default function Articles({ articles }) {
  return (
    <Layout title='Articles'>
      <main>
        <CloudBackgroundOrange />

        <div className='container py-4 articles-page'>
          <h1 className='text-center hero-text text-black-50 mb-4'>
            Articles
          </h1>

          <div className='article-list'>
            {articles.map((article) => (
              <ArticleSummary article={article} key={article.id} />
            ))}
          </div>
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
      const { meta, body } = parseFrontmatter(raw)
      const excerpt = meta.excerpt || body.trim().split('\n\n')[0] || ''
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
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return {
    props: {
      articles,
    },
  }
}
