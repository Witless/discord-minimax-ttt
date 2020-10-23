import {Game} from "./game";
import {Move} from "./moves";
import {Board} from "./board";

/**
 * Global variable "choice" that will be returned on getChoice() calls
 */
let choice:Move;

/**
 * Function to be called whenever a new state is wished
 * @param game
 */
export default function getChoice(game:Game):Move {
    minimax(game, 0)
    return choice;
}

/**
 * Minimax recursive algorithm, it'll call itself recursively getting all the possible moves for the Game passed
 * until a final state (Win, Lose, Draw) after that it'll propagate the game score upwards comparing it to the other
 * obtained final states and depending on which player was that move from it will select either the minimum or maximum
 * of the scores
 *
 * Now to see whether get the minimum or maximum from the scores, it's based on whose the state of the game from the
 * beginning, if it's the opposite (As the max players are 2) from the beginning it'll select the minimum if not,
 * the maximum
 *
 * @param game
 * @param depth
 */
function minimax (game:Game, depth:number):number {

    if(game.isOver()){
        return Game.score(game, depth);
    }
    console.log(depth)
    depth += 1;

    let scores:number[] = [];

    let moves:Move[] = [];

    game.getAvailableMoves().forEach((i) => {
        console.log(i);
        const possible_game = game.getNewState(i.x, i.y)
        scores.push( minimax(possible_game, depth) )
        moves.push(i)
    })

    if(game.getPlayer() === Board.playerA){
        const max_index = scores.indexOf(Math.max.apply(null, scores));
        choice = moves[max_index];
        return scores[max_index];
    }else{
        const min_index = scores.indexOf(Math.min.apply(null, scores));
        choice = moves[min_index];
        return scores[min_index];
    }


}