import React from 'react';
import DraggableRandomShape from './DraggableRandomShape'
import '../globals.css';
import { arrayToFilename } from "./helpers/arrayToFilename";
import {RenderSVGShape, renderShape} from './Shape'
interface GridProps {
  g: any; // Replace 'any' with the actual type of 'g'
  cellN: number;
  activeShape: any; // Replace 'any' with the actual type of 'activeShape'
  shapes: any[]; // Replace 'any' with the actual shape type if known
  score: number;
  state: any; // Replace 'any' with the actual type of 'state'
  shapesVisible: boolean;
}
function Grid({g, cellN, activeShape, shapes, score, state, shapesVisible}: GridProps) {
  console.log(g)
  const rowIndex = Math.floor((cellN - 1) / 7); // Row index based on the cell number
  const cellIndex = (cellN - 1) % 7;
  console.log(cellN, rowIndex, cellIndex)
  console.log('activeshape:', activeShape, shapes, shapes[activeShape])
return (
  <div className='grid-wrapper'>
    <div className='stats'>
      <div className="player-info left">
      <p className='player'>{state.players[0]?.adr}</p>
      <p>${state.players[0]?.score}</p>
      </div>
      
      <div className="level-info">
        <p>Round {state.round} / 12</p>
      </div>
      
      <div className="player-info right">
      <p className='player'>{state.players[1]?.adr}</p>
      <p>${state.players[1]?.score}</p>
      </div>
    </div>
    <div className="grid-container">
    {activeShape !=undefined && <ActiveShapeOverlay activeShape={shapes[activeShape]} />}

        {g.map((line:any, rowIndex:any) => (
            <div key={rowIndex} 
            className={`grid-row ${rowIndex === g.length - 1 ? 'last-row' : ''}`}>
                {line.map((cell:any, cellIndex:any) => {
                  const index = (rowIndex * 7 + cellIndex)+1; // Calculate the 1D index based on row and column
                  return (
                    <div 
                      key={cellIndex} 
                      className={`grid-cell ${cell === 0 ? '' : 'filled'} ${cell[1] == 'house' && 'house'}`} 
                      style={cell === 0 ? undefined : { 
                        backgroundImage: 'url(http://localhost:3000'+cell[2]+')',
                        backgroundColor: cell[4]
                      }}
                    >
                      {cell !== 0 && cell[3]}
                      <div className="cellIndex">{index}</div> {/* Display the index */}
                    </div>
                  );
                })}
            </div>
        ))}
        {rowIndex >= 0 && rowIndex < 7 && cellIndex >= 0 && cellIndex < 7 && (
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
    <DraggableRandomShape shapesVisible={shapesVisible} activeShape={activeShape} shapes={shapes} customSettings={customSettings} />
    </div>
);
}
function ActiveShapeOverlay({activeShape}:{activeShape:any}) {
  if (!activeShape?.shape) {
    return null; // Return null if activeShape or activeShape.shape is undefined
  }
  console.log('active shape in overlay:', activeShape.shape)
  const filename = arrayToFilename(activeShape.shape);
  const imagePath = `http://localhost:3000/shapes_bitmapped2/ shape_${filename}.png`;
  const longestSide = Math.max(
    activeShape.shape.length, // Height of the shape
    ...activeShape.shape.map((row: any) => row.length) // Width of the shape (find the longest row)
  );
  return(
    <div className={'activeShapeOverlay'}>
            {renderShape(activeShape.shape, 0, 0, 35, .5)}
       </div>
  )
}
function generateRandomBlockShape(minWidth:number, maxWidth:number, minHeight:number, maxHeight:number) {
    // Input validation
    if (minWidth > maxWidth || minHeight > maxHeight) {
        
        console.log("Invalid input: min dimensions must be less than or equal to max dimensions", minWidth > maxWidth || minHeight > maxHeight);
    }
  
    function floodFill(shape:any, x:any, y:any, visited:any) {
        const height = shape.length;
        const width = shape[0].length;
        const stack = [[x, y]];
  
        while (stack.length > 0) {
            const [cx, cy] = stack.pop() as [number, number];
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
  
    function isConnected(shape:any) {
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
                    } else {
                        return false;
                    }
                }
            }
        }
        return found;
    }
  
    function generateShape(width:any, height:any) {
        const shape = Array.from({ length: height }, () => Array(width).fill(0));
  
        // Increase the range for number of cells to fill
        const numCellsToFill = Math.floor(Math.random() * (width * height * 0.6)) + Math.ceil(width * height * 0.4);
        let filledCells = 0;
        let x = Math.floor(Math.random() * width);
        let y = Math.floor(Math.random() * height);
  
        while (filledCells < numCellsToFill) {
            if (shape?[y][x] === 0 : undefined) {
                shape?[y][x] = 1 : undefined;
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
  
    function trimShape(shape:any) {
      // Remove empty rows from the top
      while (shape.length > 0 && shape[0].every((cell:any) => cell === 0)) {
        shape.shift();
      }
      // Remove empty rows from the bottom
      while (shape.length > 0 && shape[shape.length - 1].every((cell:any) => cell === 
    0)) {
        shape.pop();
      }
      // Remove empty columns from the left
      let colIndex = 0;
      while (colIndex < shape[0].length) {
        if (!shape.every((row:any) => row[colIndex] === 0)) {
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
        if (!shape.every((row:any) => row[colIndex] === 0)) {
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
    const gridSize = 7;
    
    function newGrid(initShapes:number, customSettings:object) {
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
            nGrid?[i][j] = 0 : undefined // 0 means no block
          }
        }
        return nGrid;
      }
      const placeRandomShapes = (grid:any, totalCells:any, customSettings:any) => {
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
          const shape2 = shape.shape
          // Count the number of cells occupied by the shape
          const shapeCellCount = shape2.reduce((total:any, row:any) => 
            total + row.filter((cell:any) => cell === 1).length, 0
          );
      
          // If the shape has more cells than we need, discard it and try again
          if (shapeCellCount > remainingCells) continue;
      
          const x = Math.floor(Math.random() * gridSize);
          const y = Math.floor(Math.random() * gridSize);
      
          // Check if the shape can be placed at the random position
          let canPlace = true;
          for (let i = 0; i < shape2.length; i++) {
            for (let j = 0; j < shape2[i].length; j++) {
              if (shape2[i][j] === 1) {
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
            for (let i = 0; i < shape2.length; i++) {
              for (let j = 0; j < shape2[i].length; j++) {
                if (shape2[i][j] === 1) {
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