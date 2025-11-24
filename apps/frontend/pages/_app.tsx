import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../src/components/Navbar'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Navbar />
      <main className="container">
        <Component {...pageProps} />
      </main>
    </div>
  )
}
