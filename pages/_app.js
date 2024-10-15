import 'bootstrap/dist/css/bootstrap.css' // Add this line
import 'animate.css/animate.css'
import '../styles/globals.css'
import { useEffect } from 'react'
import { DefaultSeo } from 'next-seo'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  return (
    <>
      <DefaultSeo
        titleTemplate={'%s | ContemplativeTrip '}
        defaultTitle={'ContemplativeTrip'}
      />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
