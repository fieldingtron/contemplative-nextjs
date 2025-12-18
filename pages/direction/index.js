import Layout from '../../components/Layout'
import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'

import DirectionSummary from '../../components/DirectionSummary'
import fs from 'fs'
import path from 'path'

export default function Direction({ data }) {
  // console.log('data received')
  console.log({ data })

  return (
    <Layout title='Leadership contemplative trip'>
      <main>
        <CloudBackgroundOrange />

        <div className='container py-3'>
          <h1 className='text-center hero-text text-black-50 animate__animated animate__shakeX'>
            Direction
          </h1>
          <ul>
            {data.map((data) => (
              <DirectionSummary key={data.id} data={data} />
            ))}
          </ul>
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  const dirDir = path.join(process.cwd(), 'content', 'direction')
  const files = fs.readdirSync(dirDir)

  const data = files
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const fullPath = path.join(dirDir, filename)
      const raw = fs.readFileSync(fullPath, 'utf8')
      const match = raw.match(/^---\n([\s\S]*?)\n---/)
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
        featuredImage: meta.featuredImage || '/img/blue-mandala.png',
        excerpt,
      }
    })

  return {
    props: {
      data,
    },
  }
}
