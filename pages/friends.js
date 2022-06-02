import React from 'react'
import Image from 'next/image'
import Layout from '../components/Layout'
import sunsetPic from '../public/img/sunset-clouds.jpg'
import Link from 'next/link'

export default function friends({ links }) {
  console.log(links)
  return (
    <Layout>
      <main>
        <Image
          src={sunsetPic}
          className='overlayz'
          alt='Sunset Cloud Background'
          layout='fill'
          objectFit='center'
          objectPosition='center'
        />

        <div key='main' className='container py-3 position-relative onTop100'>
          <h1 className='text-center hero-text text-black-50 py-3'>Friends</h1>
          <ul>
            <li className='fs-4'>
              <a href='#'>Website X</a>&nbsp; - what this website is about lorem
              etc
            </li>
          </ul>
          <ul>
            {links.map((link) => (
              <li className='fs-4' key={link.url}>
                <Link href={link.url} target='_blank'>
                  <a> {link.name}</a>
                </Link>
                - {link.description}
              </li>
            ))}
          </ul>

          <p className='fs-4'>
            <strong>Disclaimer : </strong>
            The friends (firms or individuals) listed on this page are simply a
            service to our web site visitors to quickly locate a spiritual web
            site of interest. We do not necessarily condone or agree with the
            mission and/or services of any of the listed friends.
          </p>
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
                query cf($id: ID = "friends") {
                  post(id: $id, idType: SLUG) {
                    slug
                    title
                    friendsLinks {
                      links {
                        description
                        detail
                        fieldGroupName
                        name
                        url
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
      links: json.data.post.friendsLinks.links,
    },
  }
}
