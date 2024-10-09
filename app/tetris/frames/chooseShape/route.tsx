/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";
import {fetchImage} from '../../fetchImage'
import {getGameState} from '../../util/getGame'
export const POST = frames(async (ctx) => {
  const currentState = ctx.state;
  const gameState = await getGameState(currentState.gameId)
  const updatedState = {
    ...currentState,
    ...gameState,
    piece: ctx.message?.inputText,
    //grid: ctx.searchParams.updateGrid ? gameState.grid : currentState.grid
  };
  return {
    image: await fetchImage(updatedState),
    imageOptions: { aspectRatio: '1:1'},
    state: updatedState,
    textInput: updatedState.turn == updatedState.activePlayer ? 'Choose Shape 1-3' : null,
    buttons: [
      // With query params
      updatedState.turn == updatedState.activePlayer ? 
        <Button
          action="post"
          target={{ query: { shapeChosen: "true" }, pathname: "/frames/move" }}
        >
          Choose Shape
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
