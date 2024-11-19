/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";
import {fetchImage} from '../../fetchImage'
import { placeShape } from '../../placeShape'
import { checkShapeState } from "../../helpers/checkShapeState";
import {setGrid,updateShapes,levelHandler, getGameState, modifyScore} from '../../util/getGame'

const pointsPerCell = 5;
export const POST = frames(async (ctx:any) => {
  const currentState = ctx.state;
  const y = Math.floor((ctx.message.inputText - 1) / 7); // Row index based on the cell number
  const x = (ctx.message.inputText - 1) % 7;
  const newGrid = await placeShape(currentState.shapes[currentState.activeShape].shape, currentState.grid, x, y, currentState.gameId, currentState.activePlayer)
  console.log('placing shape', currentState.shapes[currentState.activeShape].shape)

  const numCells = 
    currentState.shapes[currentState.activeShape].shape.reduce((count:any, row:any) => {
      return count + row.reduce((rowCount:any, cell:any) => rowCount + (cell === 1 ? 1 : 0), 0);
    }, 0);
  const price = numCells * pointsPerCell;
  console.log('numbers:', newGrid.addToScore, currentState.score, price, numCells)
  let newShapes = currentState.shapes.filter(
    (_:any, index:any) => index !== currentState.activeShape
  );
  newShapes = await updateShapes(currentState.gameId, newShapes);
  let levelInc;
  let newTurn = currentState.turn;

  if (newGrid.placed) {
    // Update grid and call levelHandler if the shape was placed
    await setGrid(currentState.gameId, newGrid.grid);
    levelInc = await levelHandler(currentState.gameId);
    console.log('level handler:', levelInc)
    // Switch the turn to the next player after the level has been updated
    newTurn = levelInc?.turn; // Assuming levelHandler returns the updated turn
    await modifyScore(currentState.gameId, currentState.activePlayer, -price)
    await modifyScore(currentState.gameId, currentState.activePlayer, newGrid.addToScore)
  }
  const gameState = await getGameState(currentState.gameId);
  const updatedState = {
    ...currentState,
    ...gameState,
    pos: { x: currentState.pos.x, y: currentState.pos.y - 30 },
    piece: ctx.message?.inputText,
    grid: newGrid.grid,
    activeShape: newGrid.placed ? null : currentState.activeShape,
    shapes: newGrid.placed ? newShapes : currentState.shapes,
    score: newGrid.placed ? (Number(currentState.score) - Number(price)) + Number(newGrid.addToScore) : currentState.score,
    level: newGrid.placed ? levelInc?.level : currentState.level,
    round: newGrid.placed ? levelInc?.round : currentState.round,
    turn: newTurn, // Update turn to the next player
    shapesVisible: false

  };
  
  return {
    image: await fetchImage(updatedState),
    imageOptions: { aspectRatio: '1:1'},
    state: updatedState,
    //textInput: 'Choose a number',
    buttons: [
      // With query params
      updatedState.turn == updatedState.activePlayer ? 
        updatedState.level !== currentState.level ?
        <Button
          action="post"
          target={{ query: { updateGrid: "true" }, pathname: "/frames/chooseShape" }}

        >
          Next Level
        </Button>
        :
        newGrid.placed ? 
        <Button
          action="post"
          target="/frames/chooseShape"
        >
          Place Another Shape
        </Button>
        :
        <Button
          action="post"
          target="/frames/move"
        >
          Try Again!
        </Button>

      :
      <Button
          action="post"
          target="/frames/chooseShape"
        >
          Not your turn. Refresh.
      </Button>
    ],
  };
});
