import { arrayToFilename } from './helpers/arrayToFilename';

function generateRandomBlockShape(minWidth, maxWidth, minHeight, maxHeight) {
    // Input validation
    if (minWidth > maxWidth || minHeight > maxHeight) {
        
        console.log("Invalid input: min dimensions must be less than or equal to max dimensions", minWidth > maxWidth || minHeight > maxHeight);
    }
  
    function floodFill(shape, x, y, visited) {
        const height = shape.length;
        const width = shape[0].length;
        const stack = [[x, y]];
  
        while (stack.length > 0) {
            const [cx, cy] = stack.pop();
            if (cx < 0 || cy < 0 || cx >= width || cy >= height || visited[cy][cx] || shape[cy][cx] === 0) {
                continue;
            }
            visited[cy][cx] = true;
  
            stack.push([cx + 1, cy]);
            stack.push([cx - 1, cy]);
            stack.push([cx, cy + 1]);
            stack.push([cx, cy - 1]);
        }
    }
  
    function isConnected(shape) {
        const height = shape.length;
        const width = shape[0].length;
        const visited = Array.from({ length: height }, () => Array(width).fill(false));
        let found = false;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (shape[y][x] === 1) {
                    if (!found) {
                        floodFill(shape, x, y, visited);
                        found = true;
                    } else if (!visited[y][x]) {
                        return false;
                    }
                }
            }
        }
        return found;
    }
  
    function generateShape(width, height) {
        const shape = Array.from({ length: height }, () => Array(width).fill(0));
  
        // Increase the range for number of cells to fill
        const numCellsToFill = Math.floor(Math.random() * (width * height * 0.6)) + Math.ceil(width * height * 0.4);
        let filledCells = 0;
        let x = Math.floor(Math.random() * width);
        let y = Math.floor(Math.random() * height);
  
        while (filledCells < numCellsToFill) {
            if (shape[y][x] === 0) {
                shape[y][x] = 1;
                filledCells++;
            }
            
            // Randomly move in one of the four cardinal directions, with a higher chance to continue in the same direction
            const direction = Math.floor(Math.random() * 4);
            switch (direction) {
                case 0:
                    x = (x + 1) % width; // Move right
                    break;
                case 1:
                    x = (x - 1 + width) % width; // Move left
                    break;
                case 2:
                    y = (y + 1) % height; // Move down
                    break;
                case 3:
                    y = (y - 1 + height) % height; // Move up
                    break;
            }
  
            // Random chance to make a slight adjustment in direction
            if (Math.random() < 0.2) {
                const adjustDirection = Math.floor(Math.random() * 4);
                switch (adjustDirection) {
                    case 0:
                        x = (x + 1) % width; // Move right
                        break;
                    case 1:
                        x = (x - 1 + width) % width; // Move left
                        break;
                    case 2:
                        y = (y + 1) % height; // Move down
                        break;
                    case 3:
                        y = (y - 1 + height) % height; // Move up
                        break;
                }
            }
        }
  
        return shape;
    }
  
    function trimShape(shape) {
      // Remove empty rows from the top
      while (shape.length > 0 && shape[0].every(cell => cell === 0)) {
          shape.shift();
      }
      // Remove empty rows from the bottom
      while (shape.length > 0 && shape[shape.length - 1].every(cell => cell === 0)) {
          shape.pop();
      }

      // Remove empty columns from the left
      let leftIndex = 0;
      while (leftIndex < shape[0].length && shape.every(row => row[leftIndex] === 0)) {
          leftIndex++;
      }

      // Remove empty columns from the right
      let rightIndex = shape[0].length - 1;
      while (rightIndex >= 0 && shape.every(row => row[rightIndex] === 0)) {
          rightIndex--;
      }

      // Trim columns by slicing each row from leftIndex to rightIndex + 1
      shape = shape.map(row => row.slice(leftIndex, rightIndex + 1));
      
      return shape;
    }
  
    let shape;
    let width;
    let height;
    do {
        width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        shape = generateShape(width, height);
        shape = trimShape(shape);
    } while (!isConnected(shape));
  
    return { 'shape' : shape };
  }
    const gridSize = 7;
    
    export function newGrid(initShapes) {
        const customSettings = {
            "pointsPerCell": 5,
            "pointsToClear": 0,
            "buyTurnPrice": 10,
            "buyNewShapePrice": 10,
            "placeShapePrice": 5,
            "collectShapePrice": 100,
            "initGridShapes": 20,
            "randomShapeMinWidth": 1,
            "randomShapeMaxWidth": 3,
            "randomShapeMinHeight": 1,
            "randomShapeMaxHeight": 3,
            "buyShapeMinWidth": 1,
            "buyShapeMaxWidth": 3,
            "buyShapeMinHeight": 1,
            "buyShapeMaxHeight": 3,
            "showCustomUserShapes": true,
            "growShapes": true,
            "movesPerLevel": 12
          };
        let nGrid = initGrid();
        const p = placeRandomShapes(nGrid, initShapes, customSettings); // Place 5 random shapes on the grid
        
        //setGrid(nGrid);
        return nGrid;
    }
    function initGrid() {
        let nGrid = [];
        for (let i = 0; i < gridSize; i++) {
          nGrid[i] = [];
          for (let j = 0; j < gridSize; j++) {
            nGrid[i][j] = 0; // 0 means no block
          }
        }
        return nGrid;
      }
      const placeRandomShapes = (grid, totalCells, customSettings) => {
        let filledCells = 0;
        let boardVal = 0;
        while (filledCells < totalCells) {
          // Determine the maximum number of cells we can use for this shape
          const remainingCells = totalCells - filledCells;
      
          // Dynamically adjust shape generation constraints based on remaining cells
          const maxShapeSize = Math.min(remainingCells, customSettings.randomShapeMaxWidth * customSettings.randomShapeMaxHeight);
      
          let shape = generateRandomBlockShape(
            customSettings.randomShapeMinWidth, 
            Math.min(customSettings.randomShapeMaxWidth, maxShapeSize), 
            customSettings.randomShapeMinHeight, 
            Math.min(customSettings.randomShapeMaxHeight, Math.ceil(maxShapeSize / customSettings.randomShapeMinWidth))
          );
      
          shape = shape.shape;
          const shapeArray = arrayToFilename(shape);
          const shapeName = 'shape_'+shapeArray
          // Count the number of cells occupied by the shape
          const shapeCellCount = shape.reduce((total, row) => 
            total + row.filter(cell => cell === 1).length, 0
          );
      
          // If the shape has more cells than we need, discard it and try again
          if (shapeCellCount > remainingCells) continue;
      
          const x = Math.floor(Math.random() * gridSize);
          const y = Math.floor(Math.random() * gridSize);
      
          // Check if the shape can be placed at the random position
          let canPlace = true;
          for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
              if (shape[i][j] === 1) {
                const newX = x + j;
                const newY = y + i;
                if (newY >= gridSize || newX >= gridSize || newY < 0 || newX < 0 || grid[newY][newX] !== 0) {
                  canPlace = false;
                  break;
                }
              }
            }
            if (!canPlace) break;
          }
      
          // Place the shape if it can fit
          if (canPlace) {
            for (let i = 0; i < shape.length; i++) {
              for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] === 1) {
                  //random value number
                  const cellImage = `${shapeName}_cells/cell_${i}_${j}.png`;
                  const rNum = Math.floor(Math.random() * 100);
                  const newX = x + j;
                  const newY = y + i;
                  grid[newY][newX] = [1, 'house', cellImage, rNum];
                  boardVal += rNum;
                }
              }
            }
            filledCells += shapeCellCount;
          }
        }
        return boardVal;
      };