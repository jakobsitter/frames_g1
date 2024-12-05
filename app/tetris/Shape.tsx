import { rotateShapeArray } from './helpers/rotateShapeArray';
import { arrayToFilename } from "./helpers/arrayToFilename";

export const renderShape = (
  shape: any,
  x: any,
  y: any,
  cellSize: any,
  border: any,
  color: any,
  borderBetweenCells: boolean // New parameter to toggle behavior
) => {
  const shapeArray = arrayToFilename(shape);
  const shapeSize = getShapeDimensions(shape);
  const shapeName = 'shape_' + shapeArray;

  const parentStyle = {
    position: 'relative' as 'relative',
    width: shapeSize?.width * cellSize,
    height: shapeSize?.height * cellSize,
    left: x,
    top: y,
  };

  return (
    <div style={parentStyle}>
      {shape.map((row: any, i: any) =>
        row.map((cell: any, j: any) => {
          if (cell === 1) {
            // Determine border logic based on mode
            const rectStyle = {
              position: 'absolute' as 'absolute',
              left: j * cellSize,
              top: i * cellSize,
              width: cellSize,
              height: cellSize,
              backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}/cells_r/${shapeName}_cells/cell_${i}_${j}.png)`,
              boxSizing: 'border-box',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              borderTop: borderBetweenCells
                ? `${border}px solid ${color || 'red'}`
                : (i === 0 || shape[i - 1]?.[j] !== 1) 
                  ? `${border}px solid ${color || 'red'}` 
                  : 'none',
              borderBottom: borderBetweenCells
                ? `${border}px solid ${color || 'red'}`
                : (i === shape.length - 1 || shape[i + 1]?.[j] !== 1) 
                  ? `${border}px solid ${color || 'red'}` 
                  : 'none',
              borderLeft: borderBetweenCells
                ? `${border}px solid ${color || 'red'}`
                : (j === 0 || shape[i]?.[j - 1] !== 1) 
                  ? `${border}px solid ${color || 'red'}` 
                  : 'none',
              borderRight: borderBetweenCells
                ? `${border}px solid ${color || 'red'}`
                : (j === row.length - 1 || shape[i]?.[j + 1] !== 1) 
                  ? `${border}px solid ${color || 'red'}` 
                  : 'none',
            };

            return <div key={`${i}-${j}`} style={rectStyle}></div>;
          }
          return null;
        })
      )}
    </div>
  );
};




export const RenderSVGShape = (shape:any, x:any, y:any, cellSize:any, color:any, key:any) => {
  const width = shape[0].length * cellSize;
  const height = shape.length * cellSize;
  
  // Determine the max dimension for scaling
  const maxDimension = Math.max(width, height);
  
  // Set scale factor to fit the shape within a 100x100 viewBox
  const scaleFactor = 100 / maxDimension;

  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {shape.map((row:any, i:any) =>
        row.map((cell:any, j:any) => {
          if (cell === 1) {
            // Calculate scaled positions
            const rectX = (x + j * cellSize) * scaleFactor;
            const rectY = (y + i * cellSize) * scaleFactor;

            return (
              <rect
                key={`${i}-${j}`}
                x={rectX}
                y={rectY}
                width={cellSize * scaleFactor}
                height={cellSize * scaleFactor}
                fill="none"
                stroke="red"
                strokeWidth=".5"
                strokeDasharray="4,2"
                shapeRendering="optimizeQuality"
              />
            );
          }
          return null;
        })
      )}
      <defs>
        <linearGradient id={`glossyGradient-${key}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  );
};





const getShapeDimensions = (shape:any) => {
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
function Shape(props:any) {
  const numCells = 
     props.shape.reduce((count:any, row:any) => {
      return count + row.reduce((rowCount:any, cell:any) => rowCount + (cell === 1 ? 1 : 0), 0);
    }, 0);
  const filename = arrayToFilename(props.shape);
  const imagePath = `https://tetris.jakobseeder.pro/shapes_bitmapped2/ shape_${filename}.png`;
  const price = numCells * props.customSettings.pointsPerCell;
  const r_shape = rotateShapeArray(props.shape, 0); // Rotate the shape array
  const size = getShapeDimensions(props.shape);

  console.log(r_shape)
  return (
    <>
    <div className='shape_outer'>
        <div className={props.activeShape == props.index ? 'shape active' : 'shape'}>
            {renderShape(props.shape, 0, 0, 15, 0.25, null, true)}

       </div>
      <div className='tooltip'>
        <p className="number">{props.index+1}</p>
      <p>${price}</p>
      </div>
      </div>
      </>
  );

}
export default Shape;
