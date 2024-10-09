/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";
import {fetchImage} from '../../fetchImage'

export const POST = frames(async (ctx) => {
  const currentState = ctx.state;
  const updatedState = {
    ...currentState,
    pos: {x: currentState.pos.x+30, y: currentState.pos.y},
  };
  return {
    image: await fetchImage(updatedState.grid, updatedState.pos),
    imageOptions: { aspectRatio: '1:1'},
    state: updatedState,
    buttons: [
      <Button
        action="post"
        target="/frames/left"
      >
        ⬅️
      </Button>,
      <Button
      action="post"
      target="/frames/right"
      >
        ➡️
      </Button>,
      <Button
      action="post"
      target="/frames/up"
      >
        ⬆️
      </Button>,
      <Button
      action="post"
      target="/frames/down"
    >
      ⬇️
    </Button>
    ],
  };
});
