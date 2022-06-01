import Head from 'next/head'
import styles from '../styles/Layout.module.css'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ title, description, children }) {
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

Layout.defaultProps = {
  title: ' Contemplative Path ',
  description: 'Online and In Person Retreats',
}
