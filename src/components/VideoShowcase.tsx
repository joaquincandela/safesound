"use client";

const portrait = [
  {
    src: "/images/PIKNICXSAFESOUND.mp4",
    width: 1080,
    height: 1920,
    label: "SafeSound en uso por Piknic",
  },
  {
    src: "/images/GRIDXSAFESOUND.mp4",
    width: 720,
    height: 1280,
    label: "SafeSound en uso por GRIDX",
  },
  {
    src: "/images/MOTO.MP4",
    width: 1080,
    height: 1920,
    label: "SafeSound en uso por MOTO",
  },
];

const landscape = [
  {
    src: "/images/JULIA.mp4",
    width: 1024,
    height: 576,
    label: "SafeSound en uso por Julia",
  },
];

function VideoBox({
  src,
  width,
  height,
  label,
  emphasis = false,
}: {
  src: string;
  width: number;
  height: number;
  label: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] bg-[#252525] ${
        emphasis
          ? "shadow-[0_24px_70px_rgba(0,0,0,0.26)] ring-1 ring-inset ring-white/10"
          : "shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
      }`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-label={label}
      />
    </div>
  );
}

export default function VideoShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-6 md:grid-cols-3">
        {portrait.map((video) => (
          <VideoBox key={video.src} {...video} emphasis />
        ))}
      </div>

      <div className="mt-6">
        {landscape.map((video) => (
          <VideoBox key={video.src} {...video} />
        ))}
      </div>
    </section>
  );
}