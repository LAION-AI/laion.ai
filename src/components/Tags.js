import Head from "next/head";
import { useRouter } from "next/router";

export default function Tags(props) {
  const title = props.title ? props.title + " | LAION" : "LAION";
  const desc = props.desc
    ? props.desc
    : "LAION, Large-scale Artificial Intelligence Open Network, is a non-profit organization making machine learning resources available to the general public.";
  const image = props.image ? props.img : "/laion.ai/social.png";
  const alt = props.alt
    ? props.alt
    : "The text: LAION. Large-scale Artificial Intelligence Open Network, TRULY OPEN AI. 100% NON-PROFIT. 100% FREE.";
  const router = useRouter();

  return (
    <Head>
      <title>{title}</title>

      <meta name="title" content={title} />
      <meta property="og:title" content={title} />
      <meta property="twitter:title" content={title} />

      <meta name="description" content={desc} />
      <meta property="og:description" content={desc} />
      <meta property="twitter:description" content={desc} />

      <meta property="og:image" content={image} />
      <meta property="twitter:image" content={image} />

      <meta name="twitter:image:alt" content={alt} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={"https://laion.ai/" + router.route} />
      <meta
        property="twitter:url"
        content={"https://laion.ai/" + router.route}
      />
      <meta property="twitter:card" content="summary_large_image" />

      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="theme-color" content="#203E55" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/laion.ai/favicon.png"
      />
    </Head>
  );
}
