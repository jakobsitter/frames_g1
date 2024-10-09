import { generateRandomBlockShape } from "./generateRandomBlockshape";

export const checkShapeState = (shapes:any) => {
    if(shapes.length <= 0) {
        const newShapes = Array.from({ length: 3 }, () =>
            generateRandomBlockShape(1, 4, 1, 4)
        );
        return newShapes;
    } else {
        return shapes;
    }
}
const shapes2 = Array.from({ length: 3 }, () =>
    generateRandomBlockShape(1, 4, 1, 4)
);

