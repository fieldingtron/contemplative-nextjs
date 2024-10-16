import React from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
// import profilePic from '../public/img/blue-mandala.png'
import moment from 'moment'

export default function ArticleSummary({ article }) {
  //console.log({ article })
  const { DOMAIN_URL } = process.env

  //article.excerpt = article.excerpt.toString().replace(DOMAIN_URL, 'XXX')
  // article.excerpt = 'gliff' + API_URL
  return (
    <div className='row py-3'>
      <div className='col-md-4 col-xxl-3 offset-xxl-1 text-center p-1 '>
        <Link
          href={`/article/${article.slug}`}
          legacyBehavior
          className='img-hover-border'
        >
          <Image
            alt={article.title}
            src={article.featuredImage}
            // layout='fill'\
            height={250}
            width={400}
            objectFit='cover'
            objectPosition='center'
            quality={100}
            className='img-thumbnail img-fluid img-hover-border'
          />
        </Link>
      </div>
      <div className='col-md-8 col-xxl-7 d-flex flex-column justify-content-center align-items-center align-items-md-start p-4 position-relative'>
        <Link href={`/article/${article.slug}`}>
          <h4>{article.title}</h4>
        </Link>
        <h6>{moment(article.date).format('MMM Do YYYY')}</h6>
        <div
          className='fs-5'
          dangerouslySetInnerHTML={{ __html: article.excerpt }}
        />
        <Link href={`/article/${article.slug}`}>
          <h5 className='img-hover-border position-relative'>
            Click here to read full article
          </h5>
        </Link>
      </div>
    </div>
  )
}
