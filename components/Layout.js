import Head from 'next/head'
import styles from '../styles/Layout.module.css'
import Header from './Header'
import Footer from './Footer'

export default function Layout({
  title = ' Contemplative Trip ',
  description = 'Online and In Person Retreats',
  children,
}) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
      </Head>
      <div className={styles.bodyz}>
        <Header />

        {children}
        <Footer />
      </div>
    </div>
  )
}
