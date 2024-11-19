export function checkLines(g:any, gridSize:any) {
    let linesCleared = 0;
    let modgrid = [...g];
    let houseScore = 0;
    let addToScore = 0;
    // Initialize the scores for each player
  
    // Function to award points to the last player
    const awardPointsToLastPlayer = (points:any) => {
        addToScore += points;
    };
  
    // Check horizontal lines
    for (let i = 0; i < gridSize; i++) {
      let isLineFull = true;
      let linePoints = 0;
      for (let j = 0; j < gridSize; j++) {
        if (modgrid[i][j] === 0) {
          isLineFull = false;
          break;
        }
        linePoints += modgrid[i][j][3];
      }
      if (isLineFull) {
        // Award points for each cell in the line to the last player
        //for (let j = 0; j < gridSize; j++) {
          awardPointsToLastPlayer(linePoints);
        //}
        // Add the points for clearing the line to the last player
        //awardPointsToLastPlayer(pointsToClear);
  
        // Shift the grid down
        for (let k = i; k > 0; k--) {
          for (let l = 0; l < gridSize; l++) {
            modgrid[k][l] = modgrid[k - 1][l];
          }
        }
        for (let l = 0; l < gridSize; l++) {
          modgrid[0][l] = 0;
        }
        linesCleared++;
      }
    }
  
    // Check vertical lines
    for (let j = 0; j < gridSize; j++) {
      let isColumnFull = true;
      let columnPoints = 0;
      for (let i = 0; i < gridSize; i++) {
        if (modgrid[i][j] === 0) {
          isColumnFull = false;
          break;
        }
        columnPoints += modgrid[i][j][3];
      }
      if (isColumnFull) {
        // Award points for each cell in the column to the last player
        //for (let i = 0; i < gridSize; i++) {
          awardPointsToLastPlayer(columnPoints);
        //}
        // Add the points for clearing the line to the last player
        //awardPointsToLastPlayer(pointsToClear);
  
        // Shift the grid left
        for (let l = j; l > 0; l--) {
          for (let k = 0; k < gridSize; k++) {
            modgrid[k][l] = modgrid[k][l - 1];
          }
        }
        for (let k = 0; k < gridSize; k++) {
          modgrid[k][0] = 0;
        }
        linesCleared++;
      }
    }
  
    return { linesCleared: linesCleared, addToScore: addToScore, modgrid: modgrid };
  }