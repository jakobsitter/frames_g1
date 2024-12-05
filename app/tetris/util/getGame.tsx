var randomColor = require('randomcolor');
import { kv } from "@vercel/kv";
import {newGrid} from '../GridHelpers'
import { checkShapeState } from "../helpers/checkShapeState";
const MAX_ROUNDS = 12;
const INIT_SCORE = 500;
type Game = {
    gameId: string;
    grid: any;
    shapes: any;
    [key: string]: any;
    turn: any;
    level: Number;
    round: Number;
    players: Array<{
        adr: any;
        score: number;
        status: 'pending',
        color: string
    }>;
};
function generateUniqueColor(assignedColors: string[]): string {
    let newColor;
    do {
        newColor = randomColor({ luminosity: 'dark' });
    } while (assignedColors.includes(newColor)); // Ensure the color is unique
    return newColor;
}
export async function getGame(gameId: string, adr: any) {
    // Retrieve the game from your key-value store
    let game = (await kv.get(gameId)) as Game | null;

    if (game) {
        console.log('game exists');

        // Check if the player already exists in the players array
        const playerExists = game.players.some((player) => player.adr === adr);

        if (!playerExists) {
            // Get all currently assigned colors
            const assignedColors = game.players.map((player) => player.color);

            // Generate a unique color
            const uniqueColor = generateUniqueColor(assignedColors);

            // Add the new player with a unique color
            game.players.push({
                adr,
                score: INIT_SCORE,
                status: 'pending',
                color: uniqueColor,
            });

            // Update the game with the new player
            await kv.set(gameId, game);
            console.log('Added new player:', adr);
        }

        return game;
    }

    console.log('game doesn\'t exist');

    // Initialize new game state
    const grid = newGrid(20);
    const shapes = checkShapeState([]);
    const turn = adr;
    const level = 1;
    const round = 1;

    // Create the new game with the initialized players array
    const newGame: Game = {
        gameId,
        grid,
        shapes,
        turn,
        level,
        round,
        players: [
            {
                adr,
                score: INIT_SCORE,
                status: 'pending',
                color: randomColor({ luminosity: 'dark' }),
            },
        ],
    };

    // Set the new game in the key-value store
    await kv.set(gameId, newGame);
    console.log('new game:', newGame);

    return newGame;
}
export async function modifyScore(gameId:string, playerAddress:string, score:number) {
    const modifyScore = createScoreModifier(gameId);
    // Modify a player's score by +50
    await modifyScore(playerAddress, score);
}
export async function getGameState(gameId:string) {
    const currentGame = await kv.get<Game>(gameId);
    return currentGame;
}
export async function setGrid(gameId:string, grid:any) {
    const setNewGrid = await updateGameProperty(gameId, {grid: grid})
    console.log('setting grid:', setNewGrid)
    return setNewGrid?.grid;
}
export async function updateShapes(gameId:string, shapes:any) {
    const checkShapes = checkShapeState(shapes);
    const setNewShapes = await updateGameProperty(gameId, {shapes: checkShapes})
    console.log('setting shapes:', setNewShapes)
    return setNewShapes?.shapes;
}
export async function levelHandler(gameId: string) {
    const currentGame = await kv.get<Game>(gameId);

    if (!currentGame) {
        console.error('Game not found!');
        return null;
    }

    let currentRound = Number(currentGame.round);
    let currentGrid = currentGame.grid;
    let level = Number(currentGame.level);

    if (currentRound < MAX_ROUNDS) {
        currentRound += 1;
    } else {
        currentRound = 0;
        level += 1;
        currentGrid = newGrid(20);

        // Generate new shapes for the new level
        const newShapes = checkShapeState([]); // Replace this with logic to generate your new shapes
        currentGame.shapes = newShapes; // Replace current shapes with the new ones
    }

    // Switch turn to the next player
    const currentTurn = currentGame.turn;
    const players = currentGame.players;

    // Find the next player (the player who is not currently in turn)
    let nextPlayer = players.find((player) => player.adr !== currentTurn)?.adr;

    if (!nextPlayer) {
        console.error('Unable to switch turn, no other player found.');
        nextPlayer = currentGame.turn; // Fallback to the current player
    }

    // Update the game properties
    const updatedProperties = {
        level: level,
        round: currentRound,
        grid: currentGrid,
        shapes: currentGame.shapes, // Ensure shapes are included in the update
        turn: nextPlayer, // Update the turn to the other player
    };

    // Save the updated game state
    const setNewLevel = await updateGameProperty(gameId, updatedProperties);
    console.log('Setting new level and switching turn:', setNewLevel);

    return setNewLevel;
}


async function updateGameProperty(gameId: string, newProperty: Partial<Game>): Promise<Game | null> {
    // Step 1: Get the current object from KV
    const currentGame = await kv.get<Game>(gameId);
  
    // If the game doesn't exist, return null or handle the error
    if (!currentGame) {
      console.error('Game not found!');
      return null;
    }
  
    // Step 2: Modify the specific property you want to update
    const updatedGame: Game = {
      ...currentGame,
      ...newProperty, // This will update or add the property
    };
  
    // Step 3: Set the updated object back to KV
    await kv.set(gameId, updatedGame);
  
    return updatedGame;
  }


  export function createScoreModifier(gameId: string) {
    return async function modifyScore(adr: any, scoreChange: number): Promise<Game | null> {
        // Retrieve the game from KV store
        const game = await kv.get<Game>(gameId);
        
        // Check if the game exists
        if (!game) {
            console.error('Game not found!');
            return null;
        }

        // Find the player in the players array
        const player = game.players.find(player => player.adr === adr);

        if (!player) {
            console.error('Player not found in game!');
            return null;
        }

        // Update the player's score
        player.score += scoreChange;

        // Save the updated game state back to KV
        const updatedGame = await kv.set(gameId, game);
        console.log(`Updated score for player ${adr}:`, player.score);

        return game;
    };
}
export async function getPlayerColor(gameId: string, adr: any): Promise<string | null> {
    // Retrieve the game from the key-value store
    const game = await kv.get<Game>(gameId);

    // Check if the game exists
    if (!game) {
        console.error('Game not found!');
        return null;
    }

    // Find the player in the players array
    const player = game.players.find(player => player.adr === adr);

    // If player exists, return their color
    if (player) {
        return player.color;
    } else {
        console.error('Player not found in game!');
        return null;
    }
}

export async function buyShape(gameId: string, adr: any): Promise<Game | null> {
    // Retrieve the game from KV store
    const game = await kv.get<Game>(gameId);

    if (!game) {
        console.error('Game not found!');
        return null;
    }

    // Find the player in the players array
    const player = game.players.find((player) => player.adr === adr);

    if (!player) {
        console.error('Player not found in game!');
        return null;
    }

    const shapeCost = 15;

    // Check if the player has enough score to buy a shape
    if (player.score < shapeCost) {
        console.error('Insufficient score to buy a shape!');
        return null;
    }

    // Deduct the cost from the player's score
    player.score -= shapeCost;

    // Add a new shape to the game
    const newShape = checkShapeState([]); // Replace with your shape generation logic
    game.shapes.push(newShape);

    // Save the updated game state back to KV
    await kv.set(gameId, game);

    console.log(`Player ${adr} purchased a shape for $${shapeCost}. Remaining score: ${player.score}`);
    return game;
}
