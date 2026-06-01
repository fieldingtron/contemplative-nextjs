import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function EventSummary({ event }) {
  const eventUrl = `/event/${event.slug || event.id.replace('.mdx', '')}`

  return (
    <article className='event-summary'>
      <Link href={eventUrl} className='event-summary__image-link' aria-label={`View ${event.title}`}>
        <span className='event-circle-image'>
          <Image
            alt={event.title}
            src={event.featuredImage}
            height={220}
            width={220}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            quality={100}
            className='event-circle-image__img'
          />
        </span>
      </Link>

      <div className='event-summary__content'>
        <Link href={eventUrl} className='event-summary__title-link'>
          <h2 className='event-summary__title'>{event.title}</h2>
        </Link>
        {event.subtitle && <p className='event-summary__subtitle'>{event.subtitle}</p>}
        {event.displayDate && <p className='event-summary__date'>{event.displayDate}</p>}
        {event.description?.length > 0 && (
          <div className='event-summary__description'>
            {event.description.slice(0, 2).map((sentence) => (
              <p key={sentence}>{sentence}</p>
            ))}
          </div>
        )}
        {event.price && (
          <p className='event-summary__price'>
            <span>Price:</span> {event.price}
          </p>
        )}
        <Link href={eventUrl} className='event-summary__read-more'>
          View details
        </Link>
      </div>
    </article>
  )
}
