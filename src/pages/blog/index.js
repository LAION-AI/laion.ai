import matter from "gray-matter";
import fs from "fs";
import Link from "next/link";

export default function Blog({ posts }) {
  return (
    <div className="w-full flex justify-center">
      <div className="container">
        {posts.map(({ slug, frontmatter }) => (
          <Link href={"/blog/" + slug} key={slug}>
            {slug}
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync("posts");

  const posts = files.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const readFile = fs.readFileSync(`posts/${fileName}`, "utf-8");
    const { data: frontmatter } = matter(readFile);

    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}
