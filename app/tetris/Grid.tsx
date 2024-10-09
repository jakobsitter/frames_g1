import React from 'react';
import DraggableRandomShape from './DraggableRandomShape'
function Grid({g, cellN, activeShape, shapes, score, state}) {
  console.log(g)
  const rowIndex = Math.floor((cellN - 1) / 10); // Row index based on the cell number
  const cellIndex = (cellN - 1) % 10;
  console.log(cellN, rowIndex, cellIndex)
return (
  <div className='grid-wrapper'>
    Level : {state.level} / Round: {state.round} / 12<br />
    Players: {state.players.map((p, i) => (
      <>{p.adr}, </>
    ))}
    <div className='score'>Score: {score} / Turn: {state.turn}</div>
    <div className="grid-container">
        {g.map((line, rowIndex) => (
            <div key={rowIndex} className="grid-row">
                {line.map((cell, cellIndex) => {
                  const index = (rowIndex * 10 + cellIndex)+1; // Calculate the 1D index based on row and column
                  return (
                    <div 
                      key={cellIndex} 
                      className={`grid-cell ${cell === 0 ? '' : 'filled'}`} 
                      style={cell === 0 ? null : { background: cell[2] }}
                    >
                      {cell !== 0 && cell[3]}
                      <div className="cellIndex">{index}</div> {/* Display the index */}
                    </div>
                  );
                })}
            </div>
        ))}
        {rowIndex >= 0 && rowIndex < 10 && cellIndex >= 0 && cellIndex < 10 && (
              <div
                  style={{
                      width: 30,
                      height: 30,
                      position: 'absolute',
                      left: cellIndex * 30, // Adjust as needed based on grid cell size
                      top: rowIndex * 30,   // Adjust as needed based on grid cell size
                      background: 'transparent',
                  }}
              >
                  {/* This is the div that moves based on cell number */}
              </div>
          )}
    </div>
    <DraggableRandomShape activeShape={activeShape} shapes={shapes} customSettings={customSettings} />
    </div>
);
}
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
      while (shape.length > 0 && shape[shape.length - 1].every(cell => cell === 
    0)) {
        shape.pop();
      }
      // Remove empty columns from the left
      let colIndex = 0;
      while (colIndex < shape[0].length) {
        if (!shape.every(row => row[colIndex] === 0)) {
          break;
        }
        colIndex++;
      }
      for (let i = 0; i < shape.length; i++) {
        shape[i].slice(colIndex).shift();
      }
      
      // Remove empty columns from the right
      colIndex = shape[0].length - 1;
      while (colIndex >= 0) {
        if (!shape.every(row => row[colIndex] === 0)) {
          break;
        }
        colIndex--;
      }
      for (let i = 0; i < shape.length; i++) {
        shape[i].slice(0, colIndex + 1).pop();
      }
    
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
    const gridSize = 10;
    
    function newGrid(initShapes:Number, customSettings:Object) {
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
                  const rNum = Math.floor(Math.random() * 100);
                  const newX = x + j;
                  const newY = y + i;
                  grid[newY][newX] = [1, 'house', '#fff', rNum];
                  boardVal += rNum;
                }
              }
            }
            filledCells += shapeCellCount;
          }
        }
        return boardVal;
      };


export default Grid;