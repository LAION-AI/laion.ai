export default function Home() {
  return (
    <div className="w-full flex justify-center py-5 pt-16">
      <div
        className="container px-5
                      child:pb-5 child:lg:pb-10 child:lg:w-2/3"
      >
        <div>
          <h1 className="text-8xl md:text-9xl font-bold pb-2">ABOUT LAION</h1>
          <p className="text-lg">
            We are a non-profit organization with members from all over the
            world, aiming to make large-scale machine learning models, datasets
            and related code available to the general public.
          </p>
        </div>
        <div className="">
          <p className="text-8xl md:text-9xl font-bold pb-2">OUR BELIEF</p>
          <p className="text-lg">
            We believe that machine learning research and its applications have
            the potential to have huge positive impacts on our world and
            therefore should be democratized.
          </p>
        </div>
        <div>
          <p className="text-8xl md:text-9xl font-bold pb-2">FUNDING</p>
          <p className="text-lg">
            Funded by donations and public research grants, our aim is to open
            all cornerstone results from such an important field as large-scale
            machine learning to all interested communities.
          </p>
        </div>
      </div>
    </div>
  );
}
