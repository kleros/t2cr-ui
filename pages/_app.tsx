import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Kleros - T2CR</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
