import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import profilePic from '../public/img/blue-mandala.png'

export default function EventSummary({ event }) {
  //console.log({ event })
  return (
    <div className='row py-2'>
      <div className='col-md-4 text-center p-1'>
        {
          <Link href={event.uri}>
            <a>
              <Image
                alt={event.featuredImage.node.altText}
                src={event.featuredImage.node.sourceUrl}
                // layout='fill'\
                height={200}
                width={200}
                objectFit='cover'
                objectPosition='center'
                quality={100}
                className='rounded-circle img-fluid'
              />
            </a>
          </Link>
        }
      </div>
      <div className='col-md-8 d-flex flex-column justify-content-center align-items-center align-items-md-start p-4'>
        <Link href={event.uri}>
          <a className='noLink position-relative'>
            <h4 className='text-start'>{event.title}</h4>
            {event.requiredData.subtitle && (
              <h4 className='text-start'>{event.requiredData.subtitle}</h4>
            )}
            {event.requiredData.subtitle2 && (
              <h4 className='text-start'>{event.requiredData.subtitle2}</h4>
            )}
            {event.requiredData.subtitle3 && (
              <h4 className='text-start'>{event.requiredData.subtitle3}</h4>
            )}
          </a>
        </Link>
      </div>
    </div>
  )
}
