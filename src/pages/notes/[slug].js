import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import mdgh from "markdown-it-github-headings";
import Tags from "../../components/Tags";
import dateFormat from "dateformat";

export default function Post({ frontmatter, content, slug }) {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <Tags
        title={frontmatter.title}
        desc={md({ html: true }).use(mdgh, {prefixHeadingIds: false}).render(content).slice(0, 157) + "..."}
        image={frontmatter.previewImg}
        slug={"/notes/" + slug}
      />
      <div className="container px-5" lang="en">
        <h1
          lang="en"
          style={{ hyphens: "auto" }}
          className="text-8xl md:text-8xl w-full font-bold title-flow break-words"
        >
          {frontmatter.title.toUpperCase()}
        </h1>
        <p className="text-2xl pb-2">
          by: {frontmatter.author},{" "}
          {dateFormat(frontmatter.date, "dd mmm, yyyy")}
        </p>
        <hr />
        <div
          className="pt-2 article"
          dangerouslySetInnerHTML={{
            __html: md({ html: true }).use(mdgh, {prefixHeadingIds: false}).render(content),
          }}
        />
      </div>
    </div>
  );
}

export async function getStaticProps({ params: { slug } }) {
  const fileName = fs.readFileSync(`notes/${slug}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
      slug,
    },
  };
}

export async function getStaticPaths() {
  const files = fs.readdirSync("notes");

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