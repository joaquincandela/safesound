import Script from "next/script";
import "./landing.css";
import { landingHead, landingBody } from "../components/landing-markup";
import Hero3D from "../components/Hero3D";

export default function Home() {
  return (
    <>
      <div className="page">
        <div dangerouslySetInnerHTML={{ __html: landingHead }} />
        <Hero3D />
        <div dangerouslySetInnerHTML={{ __html: landingBody }} />
      </div>
      <Script src="/landing.js" strategy="afterInteractive" />
    </>
  );
}
