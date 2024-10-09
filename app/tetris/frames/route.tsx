/* eslint-disable react/jsx-key */
import { frames } from "./frames";
import { Button } from "frames.js/next";
import {fetchImage} from '../fetchImage'
import {getGame} from '../util/getGame'
import { kv } from "@vercel/kv";
const handler = frames(async (ctx) => {
  const currentState = ctx.state;
  let screen = 'userInput';
  let getStateR;
  if(ctx.searchParams.checkGame) {
    getStateR = await getGame(ctx.message?.inputText, currentState.activePlayer)
    console.log('looking up ', ctx.message?.inputText, 'jakob')
    //console.log('kv: ', getStateR)
  }
  if(ctx.searchParams.checkUser) {
    screen = 'gameInput';

  }
  const readyToPlay = ctx.searchParams.checkGame;
  const updatedState = {
    ...currentState,
    ...(readyToPlay ? getStateR : {}),
    activePlayer: ctx.searchParams.checkUser ? ctx.message?.inputText : currentState.activePlayer
  };
  
  return {
    image: readyToPlay ? await fetchImage(updatedState) : 
    (
      <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex text-[48px]">
        {screen == 'userInput' ? 'Enter Username' : 'Logged in as '+updatedState.activePlayer+'. Enter Game ID to play.'}
      </div>
    ),
    imageOptions: { aspectRatio: '1:1'},
    textInput: !readyToPlay ? screen == 'userInput' ? 'Enter UserId' : 'Enter GameID' : null,
    state: updatedState,
    buttons: [
      // With query params
      !readyToPlay ?
        screen == 'userInput' ? (
          <Button
            action="post"
            target={{query: { checkUser: "true" }, pathname: "/frames" }}
          >
            Look up User
         </Button>) : 
          <Button
            action="post"
            target={{ query: { checkGame: "true" }, pathname: "/frames" }}
          >
            Look up Game
          </Button>
      :
      <Button
        action="post"
        target={{ query: { checkGame: "true" }, pathname: "/frames/chooseShape" }}
      >
        Play
      </Button>
    ],
  };
});

export const GET = handler;
export const POST = handler;
