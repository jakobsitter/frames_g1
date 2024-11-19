export function rotateShapeArray(shape:any, angle:any) {
    // Ensure the angle is a multiple of 90 degrees
    const numRotations = ((angle % 360) / 90 + 4) % 4; // Handles negative angles
    let rotatedShape = shape;
    for (let i = 0; i < numRotations; i++) {
        rotatedShape = rotate90Degrees(rotatedShape);
    }
    return rotatedShape;
}

function rotate90Degrees(matrix:any) {
    // Transpose the matrix and then reverse each row to rotate 90 degrees clockwise
    return matrix[0].map((_:any, colIndex:any) => matrix.map((row:any) => row[colIndex]).reverse());
}
