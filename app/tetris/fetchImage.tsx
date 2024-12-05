import Grid from "./Grid";
import Leaderboard from "./Leaderboard";
//import { renderToString } from 'react-dom/server';

export async function fetchImage(state:any, screen:string) {
  //const url = 'https://tetris-image.jakobseeder.pro'
  const url = 'http://localhost:3001'

  const { renderToString } = await import("react-dom/server");
    // Create an offscreen div to render the Grid component

    // Create a root using React 18's createRoot API
    let elem;

    if (screen === 'grid') {
      elem = (
        <Grid
          g={state.grid}
          cellN={state.piece}
          activeShape={state.activeShape}
          shapes={state.shapes}
          score={state.score}
          state={state}
          shapesVisible={state.shapesVisible}
        />
      );
    } else if (screen === 'leaderboard') {
      elem = <Leaderboard g={state.grid}
      cellN={state.piece}
      activeShape={state.activeShape}
      shapes={state.shapes}
      score={state.score}
      state={state}
      shapesVisible={state.shapesVisible} />;
    } else {
      elem = <div className='grid-wrapper'>No screen selected</div>; // Fallback for invalid `screen` values
    }
    const html = renderToString(elem);
    //console.log(html)
 // Render the Grid component

    try {
      // Wait for the component to fully render (add a slight delay if needed)
//      const response = await (await res.handler()).json() 
      const response = await fetch(url+'/screenshot', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: html }), // Use the rendered HTML
      });
//      console.log(response)
      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.imagePath;
        console.log(imageUrl)
        return imageUrl;
      } else {
        console.error("Failed to take screenshot:", response.statusText);
        return false;
      }
    } catch (error) {
      console.error("Error fetching screenshot:", error);
      return false;

    } finally {
      // Clean up: unmount the component and remove the offscreen div
    }
  };

  // Run handleScreenshot when the component mounts
 // Empty dependency array ensures it runs only once
