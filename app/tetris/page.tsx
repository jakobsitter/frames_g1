import { createExampleURL } from "../utils";
import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import { Frame } from "../components/Frame";
import {GridSVG} from './GridSVG';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Frames.js Multi Page Example",
    other: {
      ...(await fetchMetadata(createExampleURL("/tetris/frames"))),
    },
  };
}

export default async function Home() {
  const metadata = await generateMetadata();

  return (
    <>
    <Frame
      metadata={metadata}
      url={createExampleURL("/tetris/frames")}
    />
    <GridSVG />
    </>
  );
}
