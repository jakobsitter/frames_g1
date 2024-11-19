export function arrayToFilename(shapeArray:any) {
    // Convert the shape array to a string like "1_0-1_1" format
    const shapeString = shapeArray.map((row:any) => row.join('_')).join('-');
    return `${shapeString}`;
  }