import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import Tags from "../components/Tags";

export default function Post({ frontmatter, content }) {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <Tags title="Impressum" />
      <div className="container px-5">
        <h1 className="text-8xl md:text-9xl font-bold">
          {frontmatter.title.toUpperCase()}
        </h1>
        <div
          className=" article"
          dangerouslySetInnerHTML={{ __html: md().render(content) }}
        />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const fileName = fs.readFileSync(`content/impressum.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}
