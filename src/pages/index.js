import Tags from "../components/Tags";
import Link from "next/link";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

export default function Home() {
  const slideImages = [
    { url: "/laion.ai/images/gallery/dragon.jpg" },
    { url: "/laion.ai/images/gallery/charcoal.jpg" },
    { url: "/laion.ai/images/gallery/fox.jpg" },
    { url: "/laion.ai/images/gallery/river.jpg" },
  ];

  return (
    <div className="full-container  md:h-screen w-full flex flex-col items-center justify-center text-center px-5 top-add relative child:absolute">
      <Tags />
      <div className="z-0 h-screen w-full">
        <div className="slide-container">
          <Fade duration={3500} arrows={false} pauseOnHover={false}>
            {slideImages.map((slideImage, index) => {
              return (
                <img
                  src={slideImage.url}
                  className="object-cover h-full w-full opacity-20"
                  key={index}
                />
              );
            })}
          </Fade>
        </div>
      </div>
      <div className="w-full md:w-auto ">
        <div className="z-10 h-full">
          <h1 className="text-8xl md:text-8xl font-bold">LAION</h1>
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
            <Link href="/blog/laion-5b">
              <div className="">
                <p className="text-2xl pb-1">LAION-5B</p>
                <hr />
                <p className="pt-2">
                  Dataset consisting of 5.85 billion CLIP-filtered image-text
                  pairs
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
