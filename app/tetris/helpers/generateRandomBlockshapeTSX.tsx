export function generateRandomBlockShape(minWidth:any, maxWidth:any, minHeight:any, maxHeight:any) {
    // Input validation
    if (minWidth > maxWidth || minHeight > maxHeight) {
        
        console.log("Invalid input: min dimensions must be less than or equal to max dimensions", minWidth > maxWidth || minHeight > maxHeight);
    }
  
    function floodFill(shape:any, x:any, y:any, visited:any) {
        const height = shape.length;
        const width = shape[0].length;
        const stack = [[x, y]];
  
        while (stack.length > 0) {
            const [cx, cy] = stack.pop() as [any, any];
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
            if (shape[y]?.[x] === 0) {
                (shape[y] as number[])[x] = 1;  // Assert that shape[y] and shape[y][x] exist
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
        while (shape.length > 0 && shape[shape.length - 1].every((cell:any) => cell === 0)) {
            shape.pop();
        }

        // Remove empty columns from the left
        let leftIndex = 0;
        while (leftIndex < shape[0].length && shape.every((row:any) => row[leftIndex] === 0)) {
            leftIndex++;
        }

        // Remove empty columns from the right
        let rightIndex = shape[0].length - 1;
        while (rightIndex >= 0 && shape.every((row:any) => row[rightIndex] === 0)) {
            rightIndex--;
        }

        // Trim columns by slicing each row from leftIndex to rightIndex + 1
        shape = shape.map((row:any) => row.slice(leftIndex, rightIndex + 1));
        
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
  
    return { 'shape' : shape, 'color' : '#fff' };
  }