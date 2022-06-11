import matter from "gray-matter";
import fs from "fs";
import Link from "next/link";
import md from "markdown-it";

export default function Blog({ posts }) {
  return (
    <div className="w-full flex justify-center pt-16">
      <div className="container px-5">
        <h1 className="text-8xl font-bold pb-4">BLOG</h1>

        {posts.map(({ slug, frontmatter, content }) => {
          let cont = md()
            .render(content)
            .replace(/<[^>]+>/g, "");

          if (cont.length > 300) {
            cont = cont.slice(0, 300) + "...";
          }

          return (
            <Link href={"/blog/" + slug} key={slug}>
              <div className="border border-white flex flex-col md:flex-row items-stretch">
                <div>
                  <img
                    className="h-full object-cover"
                    src={frontmatter.previewImg}
                  />
                </div>
                <div className="p-5">
                  <div className="flex  pb-1 items-end">
                    <p className="text-4xl ">{frontmatter.title}</p>
                    <p className="pl-4 text-lg">by: {frontmatter.author},</p>
                    <p className="pl-2 text-lg">{frontmatter.date}</p>
                  </div>
                  <hr />
                  <p className="pt-2">{cont}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync("posts");

  const posts = files.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const readFile = fs.readFileSync(`posts/${fileName}`, "utf-8");
    const { data: frontmatter, content } = matter(readFile);

    return {
      slug,
      frontmatter,
      content,
    };
  });

  return {
    props: {
      posts,
    },
  };
}
