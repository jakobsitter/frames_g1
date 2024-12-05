import React from 'react';
import DraggableRandomShape from './DraggableRandomShape'
import '../globals.css';
import { arrayToFilename } from "./helpers/arrayToFilename";
import {RenderSVGShape, renderShape} from './Shape'
interface GridProps {
  g: any; // Replace 'any' with the actual type of 'g'
  cellN: number;
  activeShape: any; // Replace 'any' with the actual type of 'activeShape'
  shapes: any[]; // Replace 'any' with the actual shape type if known
  score: number;
  state: any; // Replace 'any' with the actual type of 'state'
  shapesVisible: boolean;
}
function Leaderboard({ g, cellN, activeShape, shapes, score, state, shapesVisible }: GridProps) {
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);

  return (
    <div className='grid-wrapper'>
      <div className='leaderboard-outer'>
        <h2>Level {state.level} Complete</h2>
        <div className='winner-section'>
          <div className='circle'></div>
          {sortedPlayers.length > 1 ? (
            <h3>
              {sortedPlayers[0].adr} is leading with{' '}
              {sortedPlayers[0].score - sortedPlayers[1].score} points.
            </h3>
          ) : (
            <h3>{sortedPlayers[0].adr} is the only player with {sortedPlayers[0].score} points.</h3>
          )}
        </div>
        <div className='leaderboard-table-outer'>
          <table className='leaderboard-table'>
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, index) => (
                <tr key={index} className={player.status === 'active' ? 'active' : ''}>
                  <td>{index + 1}</td>
                  <td className='name'>{player.adr}</td>
                  <td className='score'>{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default Leaderboard;