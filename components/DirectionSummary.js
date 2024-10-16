import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import profilePic from '../public/img/blue-mandala.png'

export default function DirectionSummary({ data }) {
  //console.log(data.slug)

  return (
    <div className='row py-2'>
      <div className='col-md-4 text-center p-1'>
        <Link href={`/direction/${data.slug}`}>
          <Image
            alt={data.title}
            src={data.featuredImage}
            height={200}
            width={200}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            quality={100}
            className='rounded-circle img-fluid position-relative'
          />
        </Link>
      </div>

      <div className='col-md-8 d-flex flex-column justify-content-center align-items-center align-items-md-start p-4'>
        <Link
          href={`/direction/${data.slug}`}
          className='noLink position-relative'
        >
          <h4 className='text-start'>{data.title}</h4>
        </Link>

        <div
          className='fs-5'
          dangerouslySetInnerHTML={{ __html: data.excerpt }}
        />

        <Link href={`/direction/${data.slug}`}>
          <p className='fs-5  position-relative'>
            Learn more about {data.title}
          </p>
        </Link>
      </div>
    </div>
  )
}
