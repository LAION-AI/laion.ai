import team from "../../content/team.json";

export default function Team() {
  return (
    <div className="w-full flex justify-center py-5 pt-16">
      <div className="container px-5">
        <h1 className="text-7xl md:text-9xl font-bold pb-2">TEAM</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {team.map((item, i) => {
            return (
              <div
                className="bg-sky border border-white flex flex-col lg:flex-row"
                key={i}
              >
                <div className="basis-1/3">
                  <img
                    className="w-full h-full object-center object-cover"
                    src={
                      item.img
                        ? item.img
                        : "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg"
                    }
                  />
                </div>
                <div className="p-5 basis-2/3">
                  <p className="text-2xl pb-1">{item.name}</p>
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
