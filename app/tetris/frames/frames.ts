import { createFrames } from "frames.js/next";
import { appURL } from "../../utils";
import { FramesMiddleware } from "frames.js/types";
import { imagesWorkerMiddleware } from "frames.js/middleware/images-worker"; 
import {fetchImage} from '../fetchImage'
import {newGrid} from '../GridHelpers'
import { farcasterHubContext } from "frames.js/middleware";
 

const customSettings = {
  //startPoints: 0,
  pointsPerCell: 5,
  pointsToClear: 0,
  buyTurnPrice: 10,
  buyNewShapePrice: 10,
  placeShapePrice: 5,
  collectShapePrice: 100,
  initGridShapes: 20,
  randomShapeMinWidth: 1,
  randomShapeMaxWidth: 3,
  randomShapeMinHeight: 1,
  randomShapeMaxHeight: 3,
  buyShapeMinWidth: 1,
  buyShapeMaxWidth: 3,
  buyShapeMinHeight: 1,
  buyShapeMaxHeight: 3,
  showCustomUserShapes: true,
  growShapes: true,
  movesPerLevel: 12
}

type PriceContext = { img?: string };
export type State = {
  grid: any;
  pos: any;
  piece: any;
  activeShape: any;
  shapes: any;
};
/*
export const framesMiddleware: FramesMiddleware<any, PriceContext> = async (
  ctx,
  next
) => {
  return new Promise((resolve, reject) => {
    // Listen for state updates
    const onStateUpdated = async (state) => {
      try {
        console.log('State updated:', state);
        // Fetch the image based on the updated state
        const img = await fetchImage(state.grid, state.piece);
        state.img = img;

        // Proceed to the next middleware or final handler
        resolve(next(state));
      } catch (error) {
        console.error('Error fetching image:', error);
        reject(error);
      } finally {
        // Remove the listener to prevent memory leaks
        stateManager.removeListener('stateUpdated', onStateUpdated);
      }
    };

    // Add the listener
    stateManager.on('stateUpdated', onStateUpdated);

    // Trigger the new game if necessary
    newGame(customSettings);
  });
};*/

export const frames = createFrames(
  {
  basePath: "/tetris",
  baseUrl: appURL(),
  debug: process.env.NODE_ENV === "development",
  imagesRoute: '/images',
  initialState: {
    grid: newGrid(20),
    pos: {x: 0, y: 0},
    piece: 0,
    activeShape: null,
    shapes: null,
    score: 500,
    gameId: '',
    level: 0,
    round: 0,
    turn: '',
    activePlayer: '',
    shapesVisible: false

  },
  middleware: [
    imagesWorkerMiddleware({
      imagesRoute: "/images", 
      secret: "SOME_SECRET_VALUE", 
    }), 
    //openframes()

    /*
    farcasterHubContext({
      hubHttpUrl: "https://nemes.farcaster.xyz:2281",
    }),*/
  ], 
});
