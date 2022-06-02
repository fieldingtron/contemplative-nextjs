import React from 'react'
import Image from 'next/image'
import profilePic from '../public/img/blue-mandala.png'

export default function Event({ post }) {
  // console.log({ post })
  return (
    <div className='row py-2'>
      <div className='col-md-4 text-center p-1'>
        <Image
          alt='Retreat Event 1'
          src={post.featuredImage.node.sourceUrl}
          // layout='fill'\
          height={200}
          width={200}
          objectFit='cover'
          objectPosition='center'
          quality={100}
          className='rounded-circle img-fluid'
        />
      </div>
      <div className='col-md-8 d-flex flex-column justify-content-center align-items-center align-items-md-start p-4'>
        <h4 className='text-start'>{post.title}</h4>
        {post.requiredData.subtitle && (
          <h4 className='text-start'>{post.requiredData.subtitle}</h4>
        )}
        {post.requiredData.subtitle2 && (
          <h4 className='text-start'>{post.requiredData.subtitle2}</h4>
        )}
        {post.requiredData.subtitle3 && (
          <h4 className='text-start'>{post.requiredData.subtitle3}</h4>
        )}
      </div>
    </div>
  )
}
