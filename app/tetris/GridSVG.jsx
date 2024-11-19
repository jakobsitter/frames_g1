import React from 'react';
import {newGrid} from './GridHelpers'

const cellSize = 30; // Size of each cell in pixels
const strokeColor = 'gray'; // Dashed line color
const cellFontFamily = 'Press Start 2P'; // Font family for text
const cellFontSize = 8; // Font size for text

function GridToSVG(gridData) {
  // Convert the grid data to SVG
  const convertToSVG = (g) => {
    const svgWidth = g[0].length * cellSize; // Calculate the width of the SVG
    const svgHeight = g.length * cellSize;   // Calculate the height of the SVG

    const svgContent = g.map((line, rowIndex) =>
      line.map((cell, cellIndex) => {
        const x = cellIndex * cellSize;
        const y = rowIndex * cellSize;
        const isFilled = cell !== 0;
        const fillColor = isFilled ? cell[2] : 'black'; // Use provided color or white if empty
        const textContent = isFilled ? cell[3] : '';

        return `
          <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" 
                fill="${fillColor}" 
                stroke="${strokeColor}" 
                stroke-width="1" 
                stroke-dasharray="4,2" />
          ${
            isFilled
              ? `<text x="${x + cellSize / 2}" y="${y + cellSize / 2}" 
                    font-family="${cellFontFamily}" 
                    font-size="${cellFontSize}" 
                    fill="black" 
                    text-anchor="middle" 
                    alignment-baseline="middle">${textContent}</text>`
              : ''
          }
        `;
      }).join('')
    ).join('');

    return `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      ${svgContent}
    </svg>`;
  };

  // Generate SVG string from grid data
  const svgString = convertToSVG(gridData);
  const base64fromSVG = svg64(svgString);
  return base64fromSVG;
}
      
export async function GridSVG() {
    let g = newGrid(20);
    let grid64 = await GridToSVG(g);
    return grid64;
}
