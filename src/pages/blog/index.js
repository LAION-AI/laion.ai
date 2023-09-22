import matter from "gray-matter";
import fs from "fs";
import Link from "next/link";
import md from "markdown-it";
import Tags from "../../components/Tags";
import dateFormat from "dateformat";
import ExportedImage from "next-image-export-optimizer";

export default function Blog({ posts }) {
  return (
    <div className="w-full flex justify-center pt-16 md:pt-5">
      <Tags title="Blog" />
      <div className="container px-5">
        <h1 className="text-8xl md:text-8xl font-bold pb-2">BLOG</h1>
        <div className="text-md pb-4">Welcome to our LAION blog! Here, you will find commentaries, news, and updates on our current research projects and progress in the field of AI research. These blog posts are not meant to be full scientific research papers, but work in progress to encourage further research / discussions on our discord server and the open scientific community.</div>
        <hr className="mb-5  md:hidden" />

        {posts.map(({ slug, frontmatter, content, date }) => {
          let cont = md()
            .render(content)
            .replace(/<[^>]+>/g, "");

          if (cont.length > 300) {
            cont = cont.slice(0, 300) + "...";
          }

          return (
            <Link href={"/blog/" + slug} key={slug}>
              <div className="border mb-5 hover:bg-paper hover:text-sky transition-colors cursor-pointer bg-sky border-paper flex flex-col lg:flex-row items-stretch shadow-lg shadow-neutral-800/20">
                <div className="basis-2/5 team-wrap">
                  <ExportedImage
                    src={frontmatter.previewImg}
                    alt={frontmatter.title}
                    layout="responsive"
                    width={1600}
                    height={900}
                  />
                </div>
                <div className="p-5 basis-3/5">
                  <p className="text-3xl">{frontmatter.title}</p>
                  <p className="text-lg pb-1">
                    by: {frontmatter.author}, {dateFormat(date, "dd mmm, yyyy")}
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
  const files = fs.readdirSync("blog");

  const posts = files.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const readFile = fs.readFileSync(`blog/${fileName}`, "utf-8");
    const { data: frontmatter, content } = matter(readFile);
    const date = Date.parse(frontmatter.date);

    return {
      slug,
      frontmatter,
      content,
      date,
    };
  });

  posts.sort((a, b) => b.date - a.date);

  return {
    props: {
      posts,
    },
  };
}
