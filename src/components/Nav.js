import React from "react";
import Link from "next/link";

export default function Nav() {
  return (
    <div
      className="bg-black w-full flex px-8 py-2 z-10 text-white items-center justify-between border-b border-white
                      child:pl-2 child:text-lg"
    >
      <Link href="/">
        <p className="text-2xl cursor-pointer pl-0">LAION</p>
      </Link>
      <div className="flex child:pl-3">
        <p>Projects</p>
        <p>Team</p>
        <Link href="/blog">Blog</Link>
        <p>About</p>
        <p>Contact</p>
        <p>FAQ</p>
      </div>
    </div>
  );
}
