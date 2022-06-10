import Nav from "./../components/Nav";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="w-screen full-container flex-col flex">
      <Nav />
      <div className="bg-black text-white grow flex child:grow flex-col h-full ">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
