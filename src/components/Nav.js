import React from "react";
import Link from "next/link";
import { slide as Menu } from "react-burger-menu";

export default function Nav() {
  var styles = {
    bmBurgerButton: {
      position: "fixed",
      width: "1.2em",
      height: "1.0em",
      right: "1.2rem",
      top: ".8em",
    },
    bmBurgerBars: {
      background: "#fff",
    },
    bmBurgerBarsHover: {
      background: "#fff",
    },
    bmCrossButton: {
      height: "24px",
      width: "24px",
    },
    bmCross: {
      background: "#fff",
    },
    bmMenuWrap: {
      position: "fixed",
      height: "100%",
      top: "0px",
    },
    bmMenu: {
      background: "#000",
      padding: "2.5em 1.5em 0",
      fontSize: "1.15em",
    },
    bmMorphShape: {
      fill: "#fff",
    },
    bmItemList: {
      color: "#fff",
      padding: "0.8em",
    },
    bmItem: {
      display: "inline-block",
      lineHeight: "1.75em",
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0.3)",
    },
  };

  return (
    <div
      className="fixed w-full flex md:flex-col px-4 py-2 md:py-5 z-30 bg-sky text-white md:h-full items-center justify-between  
                md:static md:w-auto md:bg-white md:text-sky md:justify-start md:max-h-screen
                      child:pl-2 child:text-lg"
    >
      <div>
        <Link href="/">
          <p className="text-2xl md:text-8xl cursor-pointer font-bold pl-0">
            LAION
          </p>
        </Link>
        <div
          className="md:flex child:pl-3 md:text-xl child:md:pl-1 child:md:pt-2 hidden md:flex-col 
          child:brightness-100 hover:child:brightness-75 child:transition"
        >
          <p>
            <Link href="/projects">Projects</Link>
          </p>
          <Link href="/team">Team</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <p>Contact</p>
          <p>FAQ</p>
        </div>
        <div className="md:hidden">
          <Menu right styles={styles}>
            <div>
              <p>
                <Link href="/projects">Projects</Link>
              </p>
              <p>
                <Link href="/team">Team</Link>
              </p>
              <p>
                <Link href="/blog">Blog</Link>
              </p>
              <p>
                <Link href="/about">About</Link>
              </p>
              <p>Contact</p>
              <p>FAQ</p>
            </div>
          </Menu>
        </div>
      </div>
    </div>
  );
}
