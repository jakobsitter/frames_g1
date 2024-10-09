import Grid from "./Grid";
//import { renderToString } from 'react-dom/server';

export async function fetchImage(state:any) {
  const { renderToString } = await import("react-dom/server");
  const res = await import("../../pages/api/pup/index");
    // Create an offscreen div to render the Grid component

    // Create a root using React 18's createRoot API
    const html = renderToString(<Grid g={state.grid} cellN={state.piece} activeShape={state.activeShape} shapes={state. shapes} score={state.score} state={state} />);
    //console.log(html)
 // Render the Grid component

    try {
      // Wait for the component to fully render (add a slight delay if needed)
//      const response = await (await res.handler()).json() 
      const response = await fetch("http://localhost:3001/screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: html }), // Use the rendered HTML
      });
//      console.log(response)
      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.image;
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
