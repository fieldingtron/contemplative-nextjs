import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
// import profilePic from '../public/img/blue-mandala.png'
import moment from 'moment'

export default function ArticleSummary({ article }) {
  return (
    <article className='article-summary'>
      <Link
        href={`/article/${article.slug}`}
        className='article-summary__image-link'
        aria-label={`Read ${article.title}`}
      >
        <span className='article-summary__image-frame'>
          <Image
            alt={article.title}
            src={article.featuredImage}
            height={240}
            width={360}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            quality={100}
            className='article-summary__image'
          />
        </span>
      </Link>

      <div className='article-summary__content'>
        <Link href={`/article/${article.slug}`} className='article-summary__title-link'>
          <h2 className='article-summary__title'>{article.title}</h2>
        </Link>
        <time className='article-summary__date' dateTime={article.date}>
          {moment(article.date).format('MMMM D, YYYY')}
        </time>
        <div
          className='article-summary__excerpt'
          dangerouslySetInnerHTML={{ __html: article.excerpt }}
        />
        <Link href={`/article/${article.slug}`} className='article-summary__read-more'>
          Read article
        </Link>
      </div>
    </article>
  )
}
