import Layout from '../../components/Layout'
import moment from 'moment'
import Image from 'next/image'
import sunsetPic from '../../public/img/sunset-clouds.jpg'
import EventSummary from '../../components/EventSummary'
import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from '../../lib/frontmatter'

const eventListingCopy = {
  'event-beneath-the-light-we-see': {
    description: [
      'Lynne Larson explores how dreams can open a deeper spiritual imagination.',
      'The event connects dream work with the receptive silence of Centering Prayer.',
    ],
    displayDate: 'August 14 and September 11, 2021',
    price: 'No price listed',
  },
  'event-creating-space-for-change': {
    subtitle: "Practical Exercises for Activating Your Nervous System's Ability to Calm and Heal Itself",
    description: [
      'Eric Peter guides practical exercises for calming and healing the nervous system.',
      'The morning series connects body awareness with a steadier contemplative life.',
    ],
    displayDate: 'June 3-27, 2024, Mondays-Thursdays, 6:30-7:30 a.m. MDT',
    price: 'See registration details',
  },
  'event-divine-presence': {
    description: [
      'Fr. Bill Sheehan explores how the mystery of Incarnation unfolds in daily life.',
      'This weekend retreat uses silence, teaching, and prayer to deepen awareness of divine presence.',
    ],
    price: '$295 single / $260 double; $170 commuter',
  },
  'event-embraced-in-love': {
    title: 'Embraced in Love',
    description: [
      'Fr. Bill Sheehan leads a Zoom retreat on the practice of Centering Prayer.',
      'The retreat includes teaching, prayer sits, reflection time, and space for questions.',
    ],
    displayDate: 'June 3, 2023, 11:00 a.m. - 2:00 p.m. EDT',
    price: 'See registration details',
  },
  'event-julian-of-norwich': {
    title: 'Julian of Norwich with Lynne Larson',
    subtitle: 'Retreat at Richmond Hill',
    description: [
      'Lynne Larson introduces Julian of Norwich and her enduring vision of divine love.',
      'The retreat invites reflection on hope, friendship with God, and the promise that all shall be well.',
    ],
    price: 'No price listed',
  },
  'event-living-a-centered-life-with-father-bill-sheehan-omi': {
    description: [
      'Fr. Bill Sheehan reflects on living a centered life amid disruption and change.',
      'The session points back to the divine indwelling that remains present in every circumstance.',
    ],
    price: 'No price listed',
  },
  'event-rooted-in-prayer': {
    title: 'Rooted in Prayer',
    subtitle: 'Centering Prayer and the Human Condition',
    description: [
      'Fr. Bill Sheehan leads a Zoom session on Centering Prayer and the human condition.',
      'The gathering offers practical teaching for deepening prayer and returning to inner stillness.',
    ],
    displayDate: 'Saturday, July 6, 2024, 10:00 a.m. - 2:00 p.m. EDT',
    price: '$25',
  },
}

function getDisplayDate(meta, slug) {
  if (eventListingCopy[slug]?.displayDate) {
    return eventListingCopy[slug].displayDate
  }

  if (meta.subtitle3 && !String(meta.subtitle3).includes('$')) {
    return meta.subtitle3
  }

  if (!meta.date) {
    return ''
  }

  return moment(meta.date).format('MMMM D, YYYY')
}

export default function Events({ events }) {
  const d = new Date()
  const date = moment(d).format('YYYY-MM-DD')
  const upcomingEvents = events.filter((event) => event.date > date).length

  return (
    <Layout title='Upcoming and Past Events'>
      <main>
        <Image
          src={sunsetPic}
          className='overlayz'
          alt='Sunset Cloud Background'
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />

        <div className='container py-4 events-page'>
          {upcomingEvents > 0 && (
            <h1 className='text-center hero-text text-black-50 mb-4'>
              Upcoming Events
            </h1>
          )}

          {upcomingEvents > 0 && (
            <div className='event-list'>
              {events
                .filter((event) => event.date >= date)
                .map((event) => (
                  <EventSummary event={event} key={event.id} value={event.id} />
                ))}
            </div>
          )}

          <h1 className='text-center hero-text text-black-50 my-4'>
            Past Events
          </h1>

          <div className='event-list'>
            {events
              .filter((event) => event.date < date)
              .map((event) => (
                <EventSummary event={event} key={event.id} value={event.id} />
              ))}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  const eventsDir = path.join(process.cwd(), 'content', 'events')
  const files = fs.readdirSync(eventsDir)

  const events = files
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const fullPath = path.join(eventsDir, filename)
      const raw = fs.readFileSync(fullPath, 'utf8')
      const { meta } = parseFrontmatter(raw)
      const slug = filename.replace(/\.mdx$/, '')
      const listingCopy = eventListingCopy[slug] || {}

      return {
        id: `${slug}.mdx`,
        slug,
        title: listingCopy.title || meta.title || slug,
        date: meta.date || '',
        displayDate: getDisplayDate(meta, slug),
        subtitle: listingCopy.subtitle || meta.subtitle || meta.subtitle2 || '',
        subtitle2: meta.subtitle2 || '',
        subtitle3: meta.subtitle3 || '',
        description: listingCopy.description || [],
        price: listingCopy.price || 'No price listed',
        featuredImage: meta.featuredImage || '/img/blue-mandala.png',
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return {
    props: {
      events,
    },
  }
}
