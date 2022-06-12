import Layout from '../../components/Layout'
import moment from 'moment'
import Image from 'next/image'
import sunsetPic from '../../public/img/sunset-clouds.jpg'
import EventSummary from '../../components/EventSummary'
import { NextSeo } from 'next-seo'

export default function Events({ events }) {
  // console.log('data received')
  // console.log({ events })
  //console.log('first event received')
  //const event = events[0]
  //console.log(event)
  const d = new Date()
  const date = moment(d).format('YYYY-MM-DD')
  const pastEvents = events.filter(
    (event) => event.node.requiredData.date <= date
  ).length

  const upcomingEvents = events.filter(
    (event) => event.node.requiredData.date > date
  ).length

  return (
    <Layout>
      <NextSeo title='Upcoming and Past Events' />
      <main>
        <Image
          src={sunsetPic}
          className='overlayz'
          alt='Sunset Cloud Background'
          layout='fill'
          priority
        />

        <div className='container py-3'>
          <h1 className='text-center hero-text text-black-50 animate__animated animate__shakeX'>
            {pastEvents} Past Events
          </h1>

          {events
            .filter((event) => event.node.requiredData.date <= date)
            .map((event) => (
              <EventSummary
                event={event.node}
                key={event.node.id}
                value={event.node.id}
              />
              //value={number}
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
      query eventz {
        events {
          edges {
            node {
              requiredData {
                subtitle
                subtitle2
                subtitle3
                type
                date
                location
                presenter
                registerurl
              }
              id
              uri
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
  // console.log('data here')
  // console.log(json.data)
  // console.log('edges here')
  // console.log(json.data.events.edges)

  return {
    props: {
      events: json.data.events.edges,
    },
  }
}
