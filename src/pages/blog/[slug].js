import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";

export default function Post({ frontmatter, content }) {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <div className="container px-5">
        <h1 className="text-8xl md:text-9xl font-bold pb-2">
          {frontmatter.title}
        </h1>
        <img src={frontmatter.previewImg} alt={frontmatter.title} />
        <div className="flex items-end pt-2 pb-2">
          <p className="text-lg">by: {frontmatter.author},</p>
          <p className="pl-2 text-lg">{frontmatter.date}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
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
