import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";

export default function Post({ frontmatter, content }) {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <div className="container px-5">
        <h1 className="text-8xl md:text-9xl font-bold">{frontmatter.title}</h1>
        <p className="text-2xl pb-2">
          by: {frontmatter.author}, {frontmatter.date}
        </p>
        <hr />
        <div
          className="pt-2 article"
          dangerouslySetInnerHTML={{ __html: md().render(content) }}
        />
      </div>
    </div>
  );
}

export async function getStaticProps({ params: { slug } }) {
  const fileName = fs.readFileSync(`posts/${slug}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}

export async function getStaticPaths() {
  const files = fs.readdirSync("posts");

  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
