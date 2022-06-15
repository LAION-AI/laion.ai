// 404.js
import Link from "next/link";

export default function FourOhFour() {
  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <div className="container px-5">
        <h1 className="text-7xl md:text-8xl font-bold pb-2">404 - Not Found</h1>
        <hr className="mb-5 mt-2 md:hidden" />

        <Link href="/">
          <a className="text-2xl">Go back home</a>
        </Link>
      </div>
    </div>
  );
}
