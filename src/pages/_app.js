import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";
import { RecoilRoot } from "recoil";
import { init } from "@socialgouv/matomo-next";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    console.log("%c We want them back ", "font-weight: bold; font-size: 30px;color: black; background: white;");
  }, []);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MATOMO_URL && process.env.NEXT_PUBLIC_MATOMO_SITE_ID) {
      init({
        url: process.env.NEXT_PUBLIC_MATOMO_URL,
        siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
      });
    }
  }, []);
  return (
    <>
      <Head>
        <title>We want them back</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="description" content={"We want them Back! makes information about Ancestral Remains of ancestors from colonial contexts accessible and visible."} />
        <meta name="keywords" content="Repatriation, human remains, ancestral remains, Decolonize Berlin, Counter Data" />
        {/* Open Graph  */}
        <meta property="og:url" content={"https://wewantthemback.berlin"} key="ogurl" />
        <meta property="og:image" content={"https://wewantthemback.berlin/images/wewantthemback.png"} key="ogimage" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={"we want them back"} key="sitename" />
        <meta property="og:title" content={"we want them back"} key="ogtitle" />
        <meta property="og:description" content={"We want them Back! makes information about Ancestral Remains of ancestors from colonial contexts accessible and visible."} key="ogdesc" />
        {/* Iphone */}
        {/* <link rel="icon" type="image/png" sizes="256x256" href="https://wewantthemback.berlin/images/w-256.png" /> */}
        {/* <link rel="apple-touch-icon" sizes="256x256" href="https://wewantthemback.berlin/images/w-256.png" /> */}
        <link rel="apple-touch-icon" href="https://wewantthemback.berlin/images/w-180.png" />
        {/* <link rel="apple-touch-icon" sizes="180x180" href="https://wewantthemback.berlin/images/w-180.png" /> */}
        {/* <link rel="apple-touch-icon" sizes="152x152" href="https://wewantthemback.berlin/images/w-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="https://wewantthemback.berlin/images/w-120.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="https://wewantthemback.berlin/images/w-76.png" /> */}
      </Head>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </>
  );
}
