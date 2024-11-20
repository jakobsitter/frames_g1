/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";
import {fetchImage} from '../../fetchImage'
import { rotateShapeArray } from "../../helpers/rotateShapeArray";
import {setGrid,updateShapes,getGameState} from '../../util/getGame'

export const POST = frames(async (ctx:any) => {
  const currentState = ctx.state;
  let newShapes = currentState.shapes;
  if(ctx.searchParams.rotateActive) {
    let aS = newShapes[currentState.activeShape].shape;
    let aSR = rotateShapeArray(aS, 90);
    console.log('shape rotation', aSR, aS)
    newShapes[currentState.activeShape].shape = aSR;
  }
  newShapes = await updateShapes(currentState.gameId, newShapes);
  const gameState = await getGameState(currentState.gameId);

  const updatedState = {
    ...currentState,
    ...gameState,
//    pos: {x: currentState.pos.x, y: currentState.pos.y-30},
    //piece: ctx.message?.inputText,
    shapes: newShapes,
    activeShape: ctx.searchParams.shapeChosen ? Number(ctx.message?.inputText) - 1 : currentState.activeShape,
    shapesVisible: false

  };
const imageData = {
    grid: updatedState.grid,
    cellN: currentState.piece,
    activeShape: currentState.activeShape,
    shapes: currentState.shapes,
    score: currentState.score
  }
  return {
    image: await fetchImage(updatedState),   
    imageOptions: { aspectRatio: '1:1'},
    state: updatedState,
    version: "vNext",
    textInput: 'Choose a number on the grid',
    buttons: [
      // With query params
      <Button
        action="post"
        target="/frames/placedShape"
      >
        Place Shape
      </Button>,
      <Button
      action="post"
      target={{ query: { rotateActive: "true" }, pathname: "/frames/move" }}
      >
      Rotate Shape
    </Button>,
    <Button
    action="post"
    target={{ query: { rotateActive: "true" }, pathname: "/frames/chooseShape" }}
    >
      Choose Another
    </Button>
    ],
  };
});
