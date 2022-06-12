import Nav from "./../components/Nav";
import Image from "next/image";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useRouter } from "next/router";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const onScroll = () => {
    console.log(window.scrollY);
  };

  return (
    <div className="w-screen full-container flex-col flex">
      <Nav />
      <div className=" text-white grow flex child:grow flex-col h-full ">
        <div className="h-full w-full relative child:absolute">
          <div
            className="-z-10 h-full w-full fixed"
            style={{ backgroundColor: "#0f85fa" }}
          >
            <div
              id="main-bg"
              className="h-full w-full blur-lg fixed scale-125 opacity-40"
            >
              <Image
                src="/img/sky.jpg"
                alt="Night sky"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <TransitionGroup component={null}>
            <CSSTransition key={router.route} classNames="fade" timeout={300}>
              <Component {...pageProps} />
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    </div>
  );
}

export default MyApp;
