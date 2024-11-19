import { kv } from "@vercel/kv";
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
// Factory function to create a score modifier function
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
