import Layout from '../../components/Layout'
import moment from 'moment'
import { NextSeo } from 'next-seo'
import CloudBackgroundOrange from '../../components/CloudBackgroundOrange'
import Image from 'next/legacy/image'
import { client } from '../../tina/__generated__/client'
import { TinaMarkdown } from 'tinacms/dist/rich-text'

export default function Art({ article }) {
  //console.log(' articlez received')
  //console.log(article)

  const { API_URL } = process.env

  return (
    <Layout>
      <NextSeo title={article.title} />
      <main>
        <CloudBackgroundOrange />

        <div className='container py-3 position-relative'>
          <h3 className='text-center hero-text text-black-50'>
            <span style={{ color: 'rgb(61, 89, 122)' }}>{article.title}</span>
            <br />
          </h3>

          <h6 className='mx-sm-2 mx-md-3 fs-4 my-2 text-center'>
            Date: {moment(article.date).format('MMM Do YYYY')}
          </h6>
          <div className='d-flex justify-content-center align-items-center'>
            <Image
              alt={article.title}
              src={article.featuredImage}
              // layout='fill'\
              height={400}
              width={800}
              objectFit='cover'
              objectPosition='center'
              quality={100}
              className='img-thumbnail img-fluid'
            />
          </div>

          <div className='fs-4 my-2 mx-sm-2 mx-md-3'>
            <TinaMarkdown content={article.body} />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  // Fetch the article dynamically using the slug from the URL
  const relativePath = `${params.slug}.mdx` // Assuming your files have a .md extension
  const { data } = await client.queries.article({ relativePath })
  //console.log(data)

  return {
    props: {
      article: data.article,
    },
  }
}

export async function getStaticPaths() {
  // Fetch all articles or posts to generate paths
  const { data } = await client.queries.articleConnection()

  // Map the data to generate dynamic paths based on slugs
  const paths = data.articleConnection.edges.map((post) => ({
    params: { slug: post.node._sys.filename }, // Assumes your slug matches the filename
  }))

  //console.log(paths)

  return {
    paths,
    fallback: false, // Set to true if you want fallback pages for non-pre-rendered paths
  }
}
