import { createImagesWorker } from "frames.js/middleware/images-worker/next";
import { ImageResponse } from "@vercel/og";

const imagesRoute = createImagesWorker({
  secret: "SOME_SECRET_VALUE",
});

export const GET = imagesRoute(async (jsx) => {
  
    const width = 1000;
    const height = width;
  
    return new ImageResponse(<>{jsx}</>, {
      width,
      height,
    });
  });
 