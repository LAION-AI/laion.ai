export default function Home() {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5 h-full">
      <div className="container px-5 h-full flex-col flex">
        <h1 className="text-8xl md:text-9xl font-bold pb-2">PROJECTS</h1>
        <div className="flex md:items-center h-full md:mb-20">
          <div
            className="flex flex-col md:flex-row md:justify-center  
                  child:md:w-2/5 child:border child:border-white child:bg-sky child:p-3 hover:child:bg-white hover:child:text-sky child:transition-colors child:cursor-pointer child:flex child:flex-col"
          >
            <div className="mb-5 md:mb-0 md:mr-5">
              <p className="text-4xl pb-1">LAION-400M</p>
              <hr />
              <p className="pt-2 text-lg">
                We are creating the world’s largest openly accessible
                image-text-pair dataset, as a step to democratize research on
                training of large language-image models like DALL-E & CLIP
                <br /> <br />
                Explore our already released samples (400M) & help us to quickly
                grow into the billions!
              </p>
            </div>
            <div className="">
              <p className="text-4xl pb-1">LAION-5B</p>
              <hr />
              <p className="pt-2 text-lg">
                To democratize research on large-scale multi-modal models, we
                present LAION-5B – a dataset consisting of 5.85 billion
                CLIP-filtered image-text pairs, featuring several nearest
                neighbor indices, an improved web-interface for exploration and
                subset generation, and detection scores for watermark, NSFW, and
                toxic content detection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
