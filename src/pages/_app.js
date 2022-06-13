import Nav from "./../components/Nav";
import { useRouter } from "next/router";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <div className="w-screen full-container flex-col md:flex-row flex ">
      <div className="md:basis-1/5  ">
        <Nav />
      </div>
      <div className="md:overflow-y-scroll md:max-h-screen text-white grow md:grow-0 md:basis-4/5 flex child:grow flex-col ">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
