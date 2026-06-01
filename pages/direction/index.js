import Layout from '../../components/Layout'
import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'

import DirectionSummary from '../../components/DirectionSummary'
import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from '../../lib/frontmatter'

const directionListingCopy = {
  'phil-stone': {
    order: 1,
    excerpt:
      'Phil Stone has studied contemplative prayer, spiritual direction, retreat leadership, and Christian mystics through Richmond Hill, EFM, and Shalem. He offers spiritual companionship shaped by Centering Prayer, scripture, healing prayer, and years of retreat work.',
  },
  'lynne-larson': {
    order: 2,
    excerpt:
      'Lynne Larson completed spiritual direction training through The Well Retreat Center and has long studied the mystics and spiritual practices. She leads retreats and workshops on Julian of Norwich, Celtic spirituality, dreams, and contemplative renewal.',
  },
}

export default function Direction({ data }) {
  return (
    <Layout title='Leadership contemplative trip'>
      <main>
        <CloudBackgroundOrange />

        <div className='container py-4 direction-page'>
          <h1 className='text-center hero-text text-black-50 mb-4'>
            Direction
          </h1>
          <div className='direction-list'>
            {data.map((data) => (
              <DirectionSummary key={data.id} data={data} />
            ))}
          </div>
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
      const { meta, body } = parseFrontmatter(raw)
      const slug = filename.replace(/\.mdx$/, '')
      const listingCopy = directionListingCopy[slug] || {}

      return {
        id: `${slug}.mdx`,
        slug,
        title: meta.title || slug,
        featuredImage: meta.featuredImage || '/img/blue-mandala.png',
        excerpt: listingCopy.excerpt || meta.excerpt || body.trim().split('\n\n')[0] || '',
        order: listingCopy.order || 99,
      }
    })
    .sort((a, b) => a.order - b.order)

  return {
    props: {
      data,
    },
  }
}
