import NextDocument, { Head, Html, Main, NextScript } from "next/document";
import { GoogleFont } from "react-typography";
import { Box } from "theme-ui";

import { InitializeColorMode, typographyTheme } from "../components";

const typography = { options: typographyTheme };
export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <Box as="link" rel="shortcut icon" href="/favicon.ico" />
          <GoogleFont typography={typography} />
        </Head>
        <Box as="body">
          <InitializeColorMode />
          <Main />
          <NextScript />
        </Box>
      </Html>
    );
  }
}
