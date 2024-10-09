// socketConnection.tsx
import { io } from 'socket.io-client';

const URL = 'http://localhost:5001';
export const socket = io(URL);

// Export any functions or listeners you need
export const newGame = (customSettings) => {
  socket.emit('joinGame', [
    'testgame2',
    3000,
    'jakob',
    false,
    0,
    false,
    3,
    customSettings,
  ]);
};
