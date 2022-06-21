import Tags from "../components/Tags";

import questions from "../../content/faq.json";

export default function Faq() {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <Tags title="FAQ" />
      <div className="container px-5">
        <h1 className="text-7xl md:text-8xl font-bold pb-2">FAQ</h1>
        <hr className="mb-5 mt-2 md:hidden" />

        {questions.map((item, i) => {
          return (
            <div
              className="bg-sky border border-paper mb-5 lg:flex-row p-5 shadow-lg shadow-neutral-800/20"
              key={i}
            >
              <p className="text-3xl pb-2">{item.q}</p>
              <hr />
              <p className="pt-3">{item.a}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
