import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import Image from "next/image";
import Tags from "../components/Tags";

export default function Donations({ frontmatter, content }) {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <Tags title="Donations" />
      <div className="container px-5">
        <h1 className="text-8xl md:text-8xl font-bold title-flow">
          {frontmatter.title.toUpperCase()}
        </h1>
        <hr className="mb-5 mt-2 md:hidden" />

        <div
          className="article"
          dangerouslySetInnerHTML={{ __html: md().render(content) }}
        />

        <ul className="tracking-wide mt-4 text-xl break-words">
          <li><b>Recipient:</b> {frontmatter.name}</li>
          <li><b>IBAN:</b> <span className="break-all">{frontmatter.iban}</span></li>
          <li><b>BIC:</b> {frontmatter.bic}</li>
          <li><b>Bank:</b> {frontmatter.bank}</li>
        </ul>
        <div className="mt-6 w-full max-w-[320px] bg-white p-4">
          {/* Enlarge the 160px QR at (289, 267) in the original 734x437 image. */}
          <div
            role="img"
            aria-label="Enlarged bank transfer QR code for LAION e.V. donations"
            className="aspect-square w-full"
            style={{
              backgroundImage: `url(${frontmatter.qrImage})`,
              backgroundSize: "458.75% auto",
              backgroundPosition: "50.348432% 96.389892%",
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated",
            }}
          />
        </div>
        <p className="mt-3">
          Scan the QR code in your banking app and enter your donation amount.
          You can also enter the account details above manually.
        </p>
        <figure className="mt-6 max-w-[734px]">
          <a href={frontmatter.qrImage} aria-label="Open the full-size donation QR image">
            <Image
              src={frontmatter.qrImage}
              alt="LAION e.V. GLS donations account details and bank transfer QR code"
              width={734}
              height={437}
              layout="responsive"
              unoptimized
            />
          </a>
          <figcaption className="mt-3">
            <a href={frontmatter.qrImage}>Open the full-size donation QR image</a>.
          </figcaption>
        </figure>
      </div> 
    </div>

  );
}

export async function getStaticProps() {
  const fileName = fs.readFileSync(`content/donations.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}
