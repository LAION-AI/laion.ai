import Tags from "../components/Tags";

import pressreleases from "../../content/press.json";
import dateFormat from "dateformat";

export default function Press() {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <Tags title="Press" />
      <div className="container px-5">
        <h1 className="text-7xl md:text-8xl font-bold pb-2">PRESS RELEASES</h1>
        <hr className="mb-5 mt-2 md:hidden" />

        {pressreleases.sort(function(a,b) {
          return Date.parse(dateFormat(b.dt)) - Date.parse(dateFormat(a.dt))
        }).map((item, i) => {
          return (
            <div
              className="bg-sky border border-paper mb-5 lg:flex-row p-5 shadow-lg shadow-neutral-800/20"
              key={i}
            >
              <p className="text-3xl pb-2">{dateFormat(item.dt, "d mmmm, yyyy")} - <b className="tracking-wider">{item.url.split("www.")[1].split('/')[0].toUpperCase()}</b></p>
              <a className="pt-3 break-all" href={item.url}>{item.url}</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
