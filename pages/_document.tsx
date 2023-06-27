import { selectAppState } from "@/redux/appSlice";
import { Html, Head, Main, NextScript } from "next/document";
import { useSelector } from 'react-redux'

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
