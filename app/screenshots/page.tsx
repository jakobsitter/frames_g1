'use client'
import Grid from "../tetris/Grid";
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);

  const handleScreenshot = async () => {
    const { renderToString } = await import("react-dom/server");
    // Create an offscreen div to render the Grid component
    const html = renderToString(<Grid />);

    // Create a root using React 18's createRoot API

    try {
      // Wait for the component to fully render (add a slight delay if needed)
      await new Promise((resolve) => setTimeout(resolve, 100));

      const response = await fetch("/api/pup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: html }), // Use the rendered HTML
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.image;
        setImageUrl(imageUrl);
      } else {
        console.error("Failed to take screenshot:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching screenshot:", error);
    } finally {
      // Clean up: unmount the component and remove the offscreen div
    }
  };

  // Run handleScreenshot when the component mounts
  useEffect(() => {
    handleScreenshot();
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Screenshot"
          style={{ width: "300px", height: "auto" }}
        />
      )}
    </div>
  );
}
