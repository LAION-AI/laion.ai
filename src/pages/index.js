import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

export default function Home() {
  const slideImages = [
    {
      url: "https://laion.ai/wp-content/uploads/2021/08/glassclip4-hd.png",
    },
    {
      url: "https://laion.ai/wp-content/uploads/2021/08/9a7fdb18-89fe-4b77-a80f-19b0ffd5f392-1024x1024-1038x1038.jpg",
    },
  ];

  return (
    <div
      className="h-full w-screen flex flex-col items-center justify-center text-center px-5 relative
                    child:absolute"
    >
      <div className="w-full h-full ">
        <div className="slide-container">
          <Fade arrows={false} duration={3750}>
            {slideImages.map((slideImage, index) => (
              <div className="each-fade h-full w-full" key={index}>
                <img
                  className="object-cover h-full w-full blur-xl opacity-20"
                  src={slideImage.url}
                />
              </div>
            ))}
          </Fade>
        </div>
      </div>
      <div className="z-10">
        <h1 className="text-8xl pb-1 font-bold">LAION</h1>
        <p className="italic pb-3">
          Large-scale Artificial Intelligence Open Network
        </p>
        <p className="text-2xl">TRULY OPEN AI. 100% NON-PROFIT. 100% FREE.</p>
        <div
          className="flex pt-5 
                  child:border child:border-white child:p-3 child:w-64 hover:child:bg-white hover:child:text-black child:transition-colors child:cursor-pointer"
        >
          <div className="mr-3">
            <p className="text-2xl pb-1">AION-400M</p>
            <hr />
            <p className="pt-2">
              The world’s largest openly accessible image-text-pair dataset
            </p>
          </div>
          <div className="mr-3">
            <p className="text-2xl pb-1">AION-400M</p>
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
