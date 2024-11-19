import { createExampleURL } from "../utils";
import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import { Frame } from "../components/Frame";
import Grid from './Grid';
import { newGrid } from "./GridHelpers";
import { checkShapeState } from "./helpers/checkShapeState";
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
  const state = {
    grid: newGrid(20),
    pos: {x: 0, y: 0},
    piece: 0,
    activeShape: null,
    shapes: await checkShapeState([]),
    score: 500,
    gameId: '',
    level: 0,
    round: 0,
    turn: '',
    activePlayer: '',
    players: [{
      adr: 'Jakob',
      score: 0,
      status: 'pending',
      },
      {
        adr: 'Simon',
        score: 0,
        status: 'pending',
        },
    ]
  }
  return (
    <>
    <Frame
      metadata={metadata}
      url={createExampleURL("/tetris/frames")}
    />
    <Grid g={state.grid} cellN={state.piece} activeShape={0} shapes={state.shapes} score={state.score} state={state} shapesVisible={true}  />
    </>
  );
}
