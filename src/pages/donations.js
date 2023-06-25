import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import Tags from "../components/Tags";

export default function Donations({ frontmatter, content }) {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <Tags title="Donations" />
      <div className="container px-5">
        <h1 className="text-8xl md:text-8xl font-bold">
          {frontmatter.title.toUpperCase()}
        </h1>
        <hr className="mb-5 mt-2 md:hidden" />

        <div
          className="article"
          dangerouslySetInnerHTML={{ __html: md().render(content) }}
        />

        <ul className="tracking-wide mt-4 text-xl">
          <li><b>Name:</b> {frontmatter.name}</li>
          <li><b>IBAN:</b> {frontmatter.iban}</li>
          <li><b>BIC:</b> {frontmatter.bic}</li>
        </ul>
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
