import Script from "next/script";
import "./landing.css";
import { landingMarkup } from "../components/landing-markup";

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: landingMarkup }} />
      <Script src="/landing.js" strategy="afterInteractive" />
    </>
  );
}
