import team from "../../content/team.json";
import Tags from "../components/Tags";
import ExportedImage from "next-image-export-optimizer";

export default function Team() {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <Tags
        title="Team"
        desc="The team behind LAION, the Large-scale Artificial Intelligence Open Network, a non-profit organization creating open-source machine learning resources."
      />
      <div className="container px-5">
        <h1 className="text-7xl md:text-8xl font-bold pb-2">TEAM</h1>
        <hr className="mb-5 md:hidden" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {team.map((item, i) => {
            return (
              <div
                className="bg-sky border border-paper flex flex-col lg:flex-row shadow-lg shadow-neutral-800/20"
                key={i}
              >
                <div className="basis-1/3 team-wrap">
                  <ExportedImage
                    src={
                      item.img
                        ? "/images/team/" + item.img + ".jpg"
                        : "/images/team/none.jpg"
                    }
                    alt={item.name}
                    layout="responsive"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="p-5 basis-2/3">
                  <p className="text-2xl">{item.name}</p>
                  <p className="pb-1 text-sm">{item.title}</p>
                  <hr />
                  <p className="pt-2">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
