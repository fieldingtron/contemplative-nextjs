import Layout from '../components/Layout'
import Event from '../components/Event'
import Link from 'next/link'
import moment from 'moment'
import Image from 'next/image'
import sunsetPic from '../public/img/sunset-clouds.jpg'

export default function Events({ posts }) {
  console.log({ posts })
  const d = new Date()
  const date = moment(d).format('YYYY-MM-DD')
  const pastEvents = posts.filter(
    (post) => post.requiredData.date <= date
  ).length

  const upcomingEvents = posts.filter(
    (post) => post.requiredData.date > date
  ).length

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
            {pastEvents} Past Events
          </h1>

          {posts
            .filter((post) => post.requiredData.date <= date)
            .map((post) => (
              <div key={post.id}>
                <Event post={post} />
              </div>
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
            query MyQuery {
                posts(where:{categoryName:"events"}) {
                  nodes {
                    id
                    slug
                    title
                    excerpt
                    categories {
                        nodes {
                          name
                        }
                      }
                    featuredImage {
                      node {
                        sourceUrl
                      }
                    }
                    requiredData {
                      date
                      location  
                      presenter
                      subtitle
                      subtitle2
                      subtitle3
                      type
                    }
                  }
                }
              }              
                `,
    }),
  })

  const json = await response.json()

  return {
    props: {
      posts: json.data.posts.nodes,
    },
  }
}
