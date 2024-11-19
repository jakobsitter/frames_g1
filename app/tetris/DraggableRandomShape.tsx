import Shape from "./Shape";
//import { generateRandomBlockShape } from './helpers/randomShape.jsx';
//import { arraysEqual } from "./helpers/arrayEquals.jsx";
const DraggableRandomShape = (props:any) => {
  //const combinedCollected = [...props.customShapes];
  return (
    <>
    <div className={props.shapesVisible ? 'draggableShapes-container visible' : 'draggableShapes-container'}>
      {
        props.shapes &&
        props.shapes.map((shape:any, index:any) => (
          <Shape
            key={index}
            index={index}
            shape={shape.shape}
            shapeColor={shape.color}
            customSettings={props.customSettings}
            collectible={false}
            activeShape={props.activeShape}
            />
        ))
      }
      </div>
    </>
  );
};

export default DraggableRandomShape;
