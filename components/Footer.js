import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='mt-auto'>
      <div id='footer-top'>
        {/* style='padding: 2rem 0;' */}
        <div className='container'>
          <div id='ft' className='row g-0 row-cols-1 row-cols-md-2'>
            <div className='col topfootercol'>
              <h3>About Contemplative Path</h3>
              <p id='textz' className='topfooter2nd'>
                Facilitating Contemplative Events and Retreats online and in
                person.
                <br />
                <br />
                <strong>And God said</strong> “I was a hidden treasure and
                wished to be found, so I created the earth as part of my
                universe, to share my love with all creation. ”
              </p>
            </div>
            <div className='col topfootercol'>
              <h3>Important Links</h3>
              <ul id='topfooterlinks'>
                <li>
                  <Link href='/events'>
                    <a>Events</a>
                  </Link>
                </li>
                <li>
                  <Link href='/articles'>
                    <a>Articles</a>
                  </Link>
                </li>
                <li>
                  <Link href='/direction'>
                    <a>Direction</a>
                  </Link>
                </li>
                <li>
                  <Link href='/friends'>
                    <a>Friends</a>
                  </Link>
                </li>
                <li>
                  <Link href='/contact'>
                    <a>Contact</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div id='footer-bottom' className='py-2'>
        <div className='container'>
          <div className='row row-cols-1 row-cols-md-2'>
            <div className='col text-center'>
              <Link href='/'>
                <a id='footerhomelink' className='link-secondary d-block my-2'>
                  © 2022 Contemplative Path
                </a>
              </Link>
            </div>
            {/* <div className='col'>
              <ul className='list-inline text-center my-2'>
                <li className='list-inline-item'>
                  <div className='bs-icon-circle bs-icon-semi-white'></div>
                </li>
              </ul>
            </div> */}
            <div className='col'>
              <ul
                id='terms-list'
                className='list-inline text-center text-success my-2'
              >
                <li className='list-inline-item'>
                  <Link href='/privacy'>
                    <a className='link-secondary footlink'>Privacy Policy</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
