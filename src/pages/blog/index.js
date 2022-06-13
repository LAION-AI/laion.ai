import matter from "gray-matter";
import fs from "fs";
import Link from "next/link";
import md from "markdown-it";
import Tags from "../../components/Tags";
export default function Blog({ posts }) {
  return (
    <div className="w-full flex justify-center pt-16 md:pt-5">
      <Tags title="Blog" />
      <div className="container px-5">
        <h1 className="text-8xl md:text-9xl font-bold pb-2">BLOG</h1>

        {posts.map(({ slug, frontmatter, content }) => {
          let cont = md()
            .render(content)
            .replace(/<[^>]+>/g, "");

          if (cont.length > 300) {
            cont = cont.slice(0, 300) + "...";
          }

          return (
            <Link href={"/blog/" + slug} key={slug}>
              <div className="border hover:bg-white hover:text-sky transition-colors cursor-pointer bg-sky border-white flex flex-col md:flex-row items-stretch">
                <div>
                  <img
                    className="h-full object-cover"
                    src={frontmatter.previewImg}
                  />
                </div>
                <div className="p-5 ">
                  <p className="text-3xl">{frontmatter.title}</p>
                  <p className="text-lg">
                    by: {frontmatter.author}, {frontmatter.date}
                  </p>
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
