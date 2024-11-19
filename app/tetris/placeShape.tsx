import { checkLines } from './helpers/checkLines';
import { arrayToFilename } from './helpers/arrayToFilename';
import {getPlayerColor} from './util/getGame'
// Updated placeShape function to include image cells
export const placeShape = async(shape:any, grid:any, gridX:any, gridY:any, gameId:any, activePlayer:any) => {
    const gridSize = 7;
    let canPlace = true;
    const shapeArray = arrayToFilename(shape);
    const shapeName = 'shape_'+shapeArray
    const playerColor = await getPlayerColor(gameId, activePlayer)
    console.log('Trying to place shape at', gridX, gridY);
    console.log('Got player color for', activePlayer, playerColor);

    // Check if the shape can fit in the grid
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                const newX = gridX + j;
                const newY = gridY + i;

                if (
                    newY >= gridSize || newX >= gridSize || newY < 0 || newX < 0 || 
                    grid[newY][newX][0] === 1
                ) {
                    canPlace = false;
                    break;
                }
            }
        }
        if (!canPlace) {
            console.log('Cannot place shape');
            return { grid: grid, placed: false, addToScore: 0 };
        }
    }

    // Place the shape if it can fit
    if (canPlace) {
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] === 1) {
                    const newX = gridX + j;
                    const newY = gridY + i;

                    // Construct the image path based on shape position
                    const cellImage = `/cells/${shapeName}_cells/cell_${i}_${j}.png`;

                    // Place the image path in the grid instead of just a color
                    grid[newY][newX] = [1, 'userName', cellImage, 5, playerColor];
                }
            }
        }
        const lineCheck = checkLines(grid, 7);
        return { grid: grid, placed: true, addToScore: lineCheck.addToScore };
    } else {
        console.log('Not enough points to place shape!');
        return { grid: grid, placed: false, addToScore: 0 };
    }
};
