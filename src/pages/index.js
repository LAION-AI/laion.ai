import Tags from "../components/Tags";
import Link from "next/link";
import { Fade } from "react-slideshow-image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "react-slideshow-image/dist/styles.css";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (location.hash === "#contact") {
      router.push("/gdpr");
    }
  }, []);

  return (
    <>
      <Slider className="md:hidden" />
      <div className="pt-20 md:pt-0 full-container md:h-screen w-full md:flex flex-col items-center justify-center text-center   relative child:absolute">
        <Slider className="hidden md:block" />
        <Tags />
        <div className="flex items-center justify-center w-full flex-col">
          <div className="w-auto  md:pb-0 flex flex-col md:flex-row items-center gap-4 px-4 overflow-x-hidden">
            <div className="bg-sky border-white border p-3">
              <div className="flex justify-center">
                <h1 className="text-8xl md:text-8xl font-bold">LAION</h1>
                <div className="flex items-center">
                  <img src={"/images/logo.svg"} className="pl-4 pb-1 h-16" />
                </div>
              </div>
              <p className="italic pb-3">
                Large-scale Artificial Intelligence Open Network
              </p>
              <p className="text-2xl">
                TRULY OPEN AI. 100% NON-PROFIT. 100% FREE.
              </p>
              <p className="text-lg py-4 max-w-lg flex m-auto">
                LAION, as a non-profit organization, provides datasets, tools
                and models to liberate machine learning research. By doing so,
                we encourage open public education and a more
                environment-friendly use of resources by reusing existing
                datasets and models.
              </p>
              <div className="text-2xl text-yellow-400 font-bold">
                A CERN FOR OPEN SOURCE LARGE-SCALE AI RESEARCH!
              </div>
              <div className="my-2">
                <a
                  href="https://laion.ai/blog/petition/"
                  className="text-xl"
                >
                  See our blog post for Open Source AI research!
                </a>
              </div>
              <div className="my-2">
                <a
                  href="https://www.openpetition.eu/petition/online/securing-our-digital-future-a-cern-for-open-source-large-scale-ai-research-and-its-safety"
                  className="text-xl"
                >
                  Sign our petition for Open Source AI research!
                </a>
              </div>
              <div>
                <a href="https://discord.gg/xBPBXfcFHd" className="text-xl">
                  Join our community on discord!
                </a>
              </div>
            </div>

            <div
              className="w-fit h-fit items-center grid sm:grid-cols-2 gap-4
            child:h-full child:flex child:flex-col child:justify-center
                      child:border child:border-paper child:bg-sky child:p-3 child:max-w-[16rem] hover:child:bg-paper hover:child:text-sky child:transition-colors child:cursor-pointer child:mx-auto md:child:mx-0"
            >
              <Link href="/blog/laion-400-open-dataset">
                <div className="">
                  <p className="text-2xl pb-1">LAION-400M</p>
                  <hr />
                  <p className="pt-2">
                    An open dataset containing 400 million English image-text
                    pairs.
                  </p>
                </div>
              </Link>
              <Link href="/blog/laion-5b">
                <div className="">
                  <p className="text-2xl pb-1">LAION-5B</p>
                  <hr />
                  <p className="pt-2">
                    A dataset consisting of 5.85 billion multilingual
                    CLIP-filtered image-text pairs.
                  </p>
                </div>
              </Link>
              <Link href="/blog/large-openclip">
                <div className="">
                  <p className="text-2xl pb-1">Clip H/14</p>
                  <hr />
                  <p className="pt-2">
                    The largest CLIP (Contrastive Language-Image Pre-training)
                    vision transformer model.
                  </p>
                </div>
              </Link>
              <Link href="/blog/laion-aesthetics">
                <div className="">
                  <p className="text-2xl pb-1">LAION-Aesthetics</p>
                  <hr />
                  <p className="pt-2">
                    A subset of LAION-5B filtered by a model trained to score
                    aesthetically pleasing images.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Slider({ className }) {
  const slideImages = ["dragon", "painting", "fox", "river"];

  return (
    <div className={"z-0 h-screen w-full fixed md:absolute " + className}>
      <div className="slide-container">
        <Fade duration={3500} arrows={false} pauseOnHover={false}>
          {slideImages.map((slideImage, index) => {
            return (
              <picture key={index}>
                <source
                  srcSet={"/images/gallery/" + slideImage + ".avif"}
                  type="image/avif"
                />
                <source
                  srcSet={"/images/gallery/" + slideImage + ".webp"}
                  type="image/webp"
                />
                <source
                  srcSet={"/images/gallery/" + slideImage + ".jpg"}
                  type="image/jpeg"
                />
                <img
                  src={"/images/gallery/" + slideImage + ".jpg"}
                  className="object-cover  h-full w-full opacity-20 md:opacity-25"
                />
              </picture>
            );
          })}
        </Fade>
      </div>
    </div>
  );
}
