import React, { useEffect } from "react";
import Link from "next/link";
import { slide as Menu } from "react-burger-menu";

export default function Nav() {
  var styles = {
    bmBurgerButton: {
      position: "fixed",
      width: "1.2em",
      height: "1.0em",
      right: "2rem",
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

  let solid = false;

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", function () {
        console.log(window.scrollY);
        if (window.scrollY >= 30) {
          if (!solid) {
            document.documentElement.style.setProperty(
              "--nav-color",
              "rgba(14, 94, 174, 1)"
            );
            solid = true;
          }
        } else {
          if (solid) {
            document.documentElement.style.setProperty(
              "--nav-color",
              "rgba(14, 94, 174, 0)"
            );
            solid = false;
          }
        }
      });
    }
  }, []);

  return (
    <div
      id="navbar"
      className="fixed w-full flex px-8 py-2 z-30 transition-colors text-white items-center justify-between 
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
      <div className="sm:hidden">
        <Menu right styles={styles}>
          <div>
            <p>Projects</p>
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
  );
}
