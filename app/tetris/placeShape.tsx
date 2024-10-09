import { checkLines } from './helpers/checkLines';

export const placeShape = (shape, grid, gridX, gridY) => {
    const gridSize = grid.length;
    // Check if the shape can fit in the grid
    let canPlace = true;
    console.log('trying to push shape to', gridX, gridY);

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                const newX = gridX + j; // Use the original column index
                const newY = gridY + i; // Use the original row index

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
            break;
        }
    }

    // Place the shape if it can fit
    if (canPlace) {
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] === 1) {
                    const newX = gridX + j; // Use the original column index
                    const newY = gridY + i; // Use the original row index
                    grid[newY][newX] = [1, 'userName', 'blue', 5]; // 1 means block
                }
            }
        }
        const lineCheck = checkLines(grid, 10);
        return { grid: grid, placed: true, addToScore: lineCheck.addToScore };
    } else {
        console.log('Not enough points to place shape!');
        return { grid: grid, placed: false, addToScore: 0 };
    }
};
