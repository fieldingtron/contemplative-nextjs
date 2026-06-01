import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function DirectionSummary({ data }) {
  return (
    <article className='direction-summary'>
      <Link href={`/direction/${data.slug}`} className='direction-summary__image-link' aria-label={`Learn more about ${data.title}`}>
        <span className='profile-circle-image'>
          <Image
            alt={data.title}
            src={data.featuredImage}
            height={200}
            width={200}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            quality={100}
            className='profile-circle-image__img'
          />
        </span>
      </Link>

      <div className='direction-summary__content'>
        <Link
          href={`/direction/${data.slug}`}
          className='direction-summary__title-link'
        >
          <h2 className='direction-summary__title'>{data.title}</h2>
        </Link>

        <p className='direction-summary__excerpt'>{data.excerpt}</p>

        <Link href={`/direction/${data.slug}`} className='direction-summary__read-more'>
          Learn more about {data.title}
        </Link>
      </div>
    </article>
  )
}
