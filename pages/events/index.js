import Layout from '../../components/Layout'
import moment from 'moment'
import Image from 'next/legacy/image'
import sunsetPic from '../../public/img/sunset-clouds.jpg'
import EventSummary from '../../components/EventSummary'
import { NextSeo } from 'next-seo'
import { client } from '../../tina/__generated__/client' // Adjust path based on your TinaCMS setup

export default function Events({ events }) {
  //console.log('data received')
  ///console.log({ events })
  //console.log('first event received')
  const event = events[0]
  // console.log('first event ')
  // console.log(event)
  const d = new Date()
  const date = moment(d).format('YYYY-MM-DD')
  const pastEvents = events.filter((event) => event.date <= date).length

  const upcomingEvents = events.filter((event) => event.date > date).length

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
          {upcomingEvents > 0 && (
            <h1 className='text-center hero-text text-black-50 animate__animated animate__shakeX'>
              Upcoming Events
            </h1>
          )}

          {upcomingEvents > 0 &&
            events
              .filter((event) => event.date >= date)
              .map((event) => (
                <EventSummary event={event} key={event.id} value={event.id} />
                //value={number}
              ))}

          <h1 className='text-center hero-text text-black-50 animate__animated animate__shakeX'>
            {pastEvents} Past Events
          </h1>

          {events
            .filter((event) => event.date < date)
            .map((event) => (
              <EventSummary event={event} key={event.id} value={event.id} />
              //value={number}
            ))}
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  // Use the pre-generated TinaCMS client to fetch the data
  const { data } = await client.queries.eventsConnection()
  //console.log(data.eventsConnection.edges)

  return {
    props: {
      events: data.eventsConnection.edges.map((edge) => edge.node),
    },
  }
}
