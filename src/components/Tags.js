import Head from "next/head";
import { useRouter } from "next/router";

export default function Tags(props) {
  const router = useRouter();

  const title = props.title ? props.title + " | LAION" : "LAION";
  const desc = props.desc
    ? props.desc
    : "LAION, Large-scale Artificial Intelligence Open Network, is a non-profit organization making machine learning resources available to the general public.";
  const image = props.image ? props.image : "/social.png";
  const alt = props.alt
    ? props.alt
    : "The text: LAION. Large-scale Artificial Intelligence Open Network, TRULY OPEN AI. 100% NON-PROFIT. 100% FREE.";
  const slug = props.slug ? props.slug : router.route;

  return (
    <Head>
      <title>{title}</title>

      <meta name="title" content={title} />
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />

      <meta name="description" content={desc} />
      <meta property="og:description" content={desc} />
      <meta name="twitter:description" content={desc} />

      <meta property="og:image" content={"https://laion.ai" + image} />
      <meta name="twitter:image" content={"https://laion.ai" + image} />

      <meta name="twitter:image:alt" content={alt} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={"https://laion.ai" + slug} />
      <meta name="twitter:url" content={"https://laion.ai" + slug} />
      <meta name="twitter:card" content="summary_large_image" />

      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="theme-color" content="#1D374E" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

      <link
        rel="preload"
        href="/fonts/DinishCondensed-Bold.woff"
        as="font"
        type="font/woff"
        crossOrigin
      />
      <link
        rel="preload"
        href="/fonts/DinishCondensed-Bold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin
      />
      <link
        rel="preload"
        href="/fonts/Dinish-Regular.woff"
        as="font"
        type="font/woff"
        crossOrigin
      />
      <link
        rel="preload"
        href="/fonts/Dinish-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin
      />
      <link
        rel="preload"
        href="/fonts/Dinish-Italic.woff"
        as="font"
        type="font/woff"
        crossOrigin
      />
      <link
        rel="preload"
        href="/fonts/Dinish-Italic.woff2"
        as="font"
        type="font/woff2"
        crossOrigin
      />
    </Head>
  );
}
