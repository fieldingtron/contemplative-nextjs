import Image from 'next/image'
import cloudPic from '../public/img/blue-clouds.jpeg'
export default function CloudBackgroundBlue() {
  return (
    <Image
      src={cloudPic}
      className='overlayz overlayz-dark'
      alt='Blue Cloud Background'
      layout='fill'
      objectFit='center'
      objectPosition='center'
      priority
    />
  )
}
