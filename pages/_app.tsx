import { AppProps } from 'next/app';

import '../scss/bulma.sass'

const Application = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default Application;