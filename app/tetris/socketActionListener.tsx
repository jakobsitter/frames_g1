import { socket } from './socketConnection';
import { stateManager } from './stateManager';

socket.on('updateShapes', (data) => {
  console.log('Received updateShapes event:', data);
  // Update the state with new data
  stateManager.updateState({
    shapes: data
  });
});
