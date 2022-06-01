import Link from 'next/link'

import { useRouter } from 'next/router'
import styles from '../styles/Header.module.css'

// Just a reminder to those who are reading this, that if you insert <a/> wrapped inside a custom component inside <Link/> that you should include passHref if the <a/> wraps anything other than a string, otherwise your site may take a hit on SEO.

export default function Header() {
  const router = useRouter()

  return (
    <header>
      <nav>
        <nav className='navbar navbar-light navbar-expand-lg'>
          <div className='container'>
            <Link href='/'>
              <a className='navbar-brand pulse'>
                Contemplative <span id='homelinkspan'> Path</span>
              </a>
            </Link>

            <button
              className='navbar-toggler'
              data-bs-toggle='collapse'
              data-bs-target='#navcol-1'
            >
              <span className='visually-hidden'>Toggle navigation</span>
              <span className='navbar-toggler-icon'></span>
            </button>
            <div id='navcol-1' className='collapse navbar-collapse fs-5'>
              <ul className='navbar-nav ms-auto'>
                <li className='nav-item'>
                  <Link href='/events'>
                    <a
                      className={
                        router.pathname == '/events'
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                    >
                      Events
                    </a>
                  </Link>
                </li>

                <li className='nav-item'>
                  <Link href='/articles'>
                    <a className='nav-link'>Articles</a>
                  </Link>
                </li>

                <li className='nav-item'>
                  <Link href='/direction'>
                    <a className='nav-link'>Direction</a>
                  </Link>
                </li>

                <li className='nav-item'>
                  <Link href='/friends'>
                    <a className='nav-link'>Friends</a>
                  </Link>
                </li>

                <li className='nav-item'>
                  <Link href='/contact'>
                    <a className='nav-link'>Contact</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </nav>
    </header>
  )
}
