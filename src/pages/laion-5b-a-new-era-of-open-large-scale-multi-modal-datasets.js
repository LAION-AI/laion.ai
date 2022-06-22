import { useEffect } from "react";
import { useRouter } from "next/router";

// FOR REDIRECT PURPOSE ONLY
export default function Redirect() {
  const router = useRouter();
  useEffect(() => {
    router.push("/blog/laion-5b");
  });

  return <></>;
}
