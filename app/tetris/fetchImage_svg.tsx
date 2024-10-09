import {GridSVG} from "./GridSVG";
//import { renderToString } from 'react-dom/server';

export async function fetchImage() {

    try {
      // Wait for the component to fully render (add a slight delay if needed)
//      const response = await (await res.handler()).json() 
      const response = await GridSVG();
      
      return response;

    } finally {
      // Clean up: unmount the component and remove the offscreen div
    }
  };

  // Run handleScreenshot when the component mounts
 // Empty dependency array ensures it runs only once
