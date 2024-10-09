import Shape from "./Shape";
//import { generateRandomBlockShape } from './helpers/randomShape.jsx';
//import { arraysEqual } from "./helpers/arrayEquals.jsx";
const DraggableRandomShape = (props) => {
  //const combinedCollected = [...props.customShapes];
  return (
    <>
    <div className={'draggableShapes-container'}>
      {
        props.shapes &&
        props.shapes.map((shape, index) => (
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
