import { rotateShapeArray } from './helpers/rotateShapeArray';

const RenderSVGShape = (shape, x, y, cellSize, color, key) => {
  let pathData = "";
  let size = getShapeDimensions(shape)
  shape.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === 1) {
        const rectX = x + j * cellSize;
        const rectY = y + i * cellSize;
        
        // Create a path for each rectangle and add it to the path data
        pathData += `M ${rectX} ${rectY} `; // Move to the top-left corner
        pathData += `H ${rectX + cellSize} `; // Draw horizontal line to the right
        pathData += `V ${rectY + cellSize} `; // Draw vertical line down
        pathData += `H ${rectX} `; // Draw horizontal line to the left
        pathData += `Z `; // Close the path (draws back to the top-left corner)
      }
    })
  );

  return (
    <svg width={size.width * cellSize} height={size.height * cellSize}>
      <path
        d={pathData}
        fill={'white'} // You can keep the gradient or a solid color
        shapeRendering="optimizeQuality"
      />
      <defs>
        {/* Define the gradient for the glossy effect */}
        <linearGradient id={"glossyGradient-"+key} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const getShapeDimensions = (shape) => {
  let width = 0;
  let height = 0;

  // Loop through each row and column of the shape
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 1) {
        // Update width and height based on the farthest cells containing a '1'
        width = Math.max(width, j + 1);  // j + 1 because it's zero-indexed
        height = Math.max(height, i + 1); // i + 1 because it's zero-indexed
      }
    }
  }

  return { width, height };
};
function Shape(props) {
  const GridCellSize = 31; // adjust to your grid cell size // Add rotation state
  const numCells = 
     props.shape.reduce((count, row) => {
      return count + row.reduce((rowCount, cell) => rowCount + (cell === 1 ? 1 : 0), 0);
    }, 0);
  const price = numCells * props.customSettings.pointsPerCell;
  const r_shape = rotateShapeArray(props.shape, 0); // Rotate the shape array
  console.log(r_shape)
  return (
    <>
    <div className='shape_outer'>
        <div className={props.activeShape == props.index ? 'shape active' : 'shape'}>
            {RenderSVGShape(props.shape, 0, 0, 31, props.shapeColor, props.index)}
       </div>
      <div className='tooltip'>
      <p>{props.index+1} / ${price}</p>
      </div>
      </div>
      </>
  );

}
export default Shape;
