import Layout from '../../components/Layout'
import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'
import Image from 'next/image'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import { parseFrontmatter } from '../../lib/frontmatter'

export default function Evt({ event }) {
  return (
    <Layout title={event.title}>
      <main>
        <CloudBackgroundOrange />
        <div className='container py-4 position-relative event-detail-page'>
          <section className='event-detail-hero'>
            <div className='event-detail-hero__image'>
              <span className='event-circle-image event-circle-image--large'>
                <Image
                  alt={event.title}
                  src={event.featuredImage}
                  height={320}
                  width={320}
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  quality={100}
                  className='event-circle-image__img'
                />
              </span>
            </div>
            <div className='event-detail-hero__content'>
              <h1 className='event-detail-title'>{event.title}</h1>
              {event.subtitle && (
                <p className='event-summary__subtitle'>{event.subtitle}</p>
              )}
              {event.subtitle2 && (
                <p className='event-summary__detail'>{event.subtitle2}</p>
              )}
              {event.subtitle3 && (
                <p className='event-summary__detail'>{event.subtitle3}</p>
              )}
            </div>
          </section>

          <div className='event-detail-body'>
            <div
              dangerouslySetInnerHTML={{ __html: event.html }}
            />
          </div>

          {event.registerurl && (
            <div className='d-flex justify-content-center'>
              <button className='btn btn-success text-white' type='button'>
                <Link className='text-white' href={event.registerurl}>
                  Register for Event
                </Link>
              </button>
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const eventsDir = path.join(process.cwd(), 'content', 'events')
  const fullPath = path.join(eventsDir, `${params.slug}.mdx`)
  const raw = fs.readFileSync(fullPath, 'utf8')

  const { meta, body } = parseFrontmatter(raw)
  const html = marked.parse(body)
  const event = {
    title: meta.title || params.slug,
    subtitle: meta.subtitle || '',
    subtitle2: meta.subtitle2 || '',
    subtitle3: meta.subtitle3 || '',
    featuredImage: meta.featuredImage || '/img/blue-mandala.png',
    registerurl: meta.registerurl || '',
    body,
    html,
  }

  return {
    props: {
      event,
    },
  }
}

// Fetch all event slugs for static paths
export async function getStaticPaths() {
  const fs = (await import('fs')).default
  const path = (await import('path')).default
  const eventsDir = path.join(process.cwd(), 'content', 'events')
  const files = fs.readdirSync(eventsDir)
  const paths = files
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => ({
      params: { slug: filename.replace(/\.mdx$/, '') },
    }))

  return {
    paths,
    fallback: false, // Set to true if you want fallback pages for non-pre-rendered paths
  }
}
