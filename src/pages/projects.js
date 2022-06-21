import Tags from "../components/Tags";
import Link from "next/link";
import projects from "../../content/projects.json";

export default function Home() {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <Tags
        title="Projects"
        desc="A selection of open-source projects maintained by LAION, the Large-scale Artificial Intelligence Open Network, to be used freely in machine learning efforts."
      />
      <div className="container px-5">
        <h1 className="text-7xl md:text-8xl font-bold pb-2">PROJECTS</h1>
        <hr className="mb-5 mt-2 md:hidden" />
        {projects.map((item, i) => {
          return (
            <Link key={i} href={item.link}>
              <div className="bg-sky border border-paper hover:bg-paper hover:text-sky transition-colors mb-5 lg:flex-row p-5 shadow-lg shadow-neutral-800/20">
                <p className="text-3xl pb-2">{item.name}</p>
                <hr />
                <p className="pt-3">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
