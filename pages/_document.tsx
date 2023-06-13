import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="/dist/css/app.css"/>
      </Head>
      <body className="main">
        <Main />
        <NextScript />
        {/* <script src="/dist/js/app.js"></script> */}
      </body>
    </Html>
  );
}
