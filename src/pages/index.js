import Tags from "../components/Tags";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full md:h-screen w-full flex flex-col items-center justify-center text-center px-5 pt-16 md:pt-0">
      <Tags />
      <div className="z-10 w-full md:w-auto">
        <h1 className="text-8xl md:text-9xl pb-1 font-bold">LAION</h1>
        <p className="italic pb-3">
          Large-scale Artificial Intelligence Open Network
        </p>
        <p className="text-2xl">TRULY OPEN AI. 100% NON-PROFIT. 100% FREE.</p>
        <div
          className="flex pt-5 flex-col md:flex-row w-full
                  child:border child:border-white child:bg-sky child:p-3 child:w-64 hover:child:bg-white hover:child:text-sky child:transition-colors child:cursor-pointer child:mx-auto md:child:mx-0"
        >
          <Link href="/blog/laion-400-open-dataset">
            <div className="mb-4 md:mb-0 md:mr-3">
              <p className="text-2xl pb-1">LAION-400M</p>
              <hr />
              <p className="pt-2">
                The world’s largest openly accessible image-text-pair dataset
              </p>
            </div>
          </Link>
          <div className="">
            <p className="text-2xl pb-1">LAION-5B</p>
            <hr />
            <p className="pt-2">
              Dataset consisting of 5.85 billion CLIP-filtered image-text pairs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
