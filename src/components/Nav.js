import React from "react";
import Link from "next/link";

export default function Nav() {
  return (
    <div
      className="bg-black fixed w-full flex px-8 py-2 z-10 text-white items-center justify-between border-b border-white
                      child:pl-2 child:text-lg"
    >
      <Link href="/">
        <p className="text-2xl cursor-pointer font-bold pl-0">LAION</p>
      </Link>
      <div className="sm:flex child:pl-3 hidden">
        <p>Projects</p>
        <Link href="/team">Team</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/about">About</Link>
        <p>Contact</p>
        <p>FAQ</p>
      </div>
    </div>
  );
}
