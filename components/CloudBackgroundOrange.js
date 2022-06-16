import React from 'react'
import Image from 'next/image'
import sunsetPic from '../public/img/sunset-clouds.jpg'

export default function CloudBackgroundOrange() {
  return (
    <Image
      src={sunsetPic}
      className='overlayz'
      alt='Sunset Pic Background'
      layout='fill'
      objectFit='center'
      objectPosition='center'
      priority
    />
  )
}
