import React from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
import profilePic from '../public/img/blue-mandala.png'

export default function DirectionSummary({ data }) {
  //console.log('data')
  //console.log({ data })
  return (
    <div className='row py-2'>
      <div className='col-md-4 text-center p-1'>
        {
          <Link href={`/direction/${data.slug}`} legacyBehavior>
            <Image
              alt={data.title}
              src={data.featuredImage}
              // layout='fill'\
              height={200}
              width={200}
              objectFit='cover'
              objectPosition='center'
              quality={100}
              className='rounded-circle img-fluid'
            />
          </Link>
        }
      </div>
      <div className='col-md-8 d-flex flex-column justify-content-center align-items-center align-items-md-start p-4'>
        <Link
          href={`/direction/${data.slug}`}
          className='noLink position-relative'
          legacyBehavior
        >
          <h4 className='text-start'>{data.title}</h4>
        </Link>
        <div
          className='fs-5'
          dangerouslySetInnerHTML={{ __html: data.excerpt }}
        />
        {/* <p>{data.node.excerpt}</p> */}
        <Link href={`/direction/${data.slug}`}>
          <p className='fs-5'>Learn more about {data.title}</p>
        </Link>
      </div>
    </div>
  )
}
