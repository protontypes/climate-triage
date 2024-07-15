import NextImage from "next/image";
import { ImageResponse } from "next/og";
import config from "./config.mts";

// // Route segment config
export const runtime = "edge";

// Image metadata
export const alt = config.meta.title;
export const size = {
  width: 600,
  height: 315
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div className="flex min-h-[630px] min-w-[1200px] flex-col items-center justify-center bg-slate-900">
        <div className="flex w-4/12 flex-col gap-6">
          <NextImage
            src="./logo.svg"
            alt={config.meta.logo}
            width={size.width}
            height={size.height}
            className="self-center"
          />
          <div className="max-w-fit self-center text-center">
            <p className="mb-4 text-lg">{config.meta.description}</p>
            <span className="text-lg text-[#00e6a7]">{config.meta.siteUrl}</span>
          </div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size
    }
  );
}
