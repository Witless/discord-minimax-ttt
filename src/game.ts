import {Board} from "./board";
import {Move} from "./moves";

export class Game extends Board{

    constructor(name:string, player:number) {
        super(name, 0, player);
    }

    isOver(): boolean {

        let currentArray:number[][] = super.getArray();
        let returnValue: boolean = false;
        /**
         * Checks if there's a win in any diagonal
         */
        if(currentArray[0][0] === currentArray[1][1] && currentArray[1][1] === currentArray[2][2] && currentArray[0][0]) {
            return true;
        }
        else if(currentArray[0][2] === currentArray[1][1] && currentArray[1][1] === currentArray[2][0] && currentArray[0][2]) {
            return true;
        }
        else{
            /**
             * Checks horizontal and vertical axis for a win
             */
            for(let i: number = 0; i < 3 && !returnValue; i++) {
                if (currentArray[i][0] === currentArray[i][1] &&  currentArray[i][1] === currentArray[i][2] && currentArray[i][0]){
                    returnValue = true;
                }
                if (currentArray[0][i] === currentArray[1][i] &&  currentArray[1][i] === currentArray[2][i] && currentArray[0][i]){
                    returnValue = true;
                }
            }
            /**
             * Below will check in case there was a draw
             */
            if(!returnValue) {
                if(currentArray[0][0] && currentArray[0][1] && currentArray[0][2] && currentArray[1][0] && currentArray[1][1] && currentArray[1][2]
                    && currentArray[2][0] && currentArray[2][1] && currentArray[2][2]){
                    returnValue = true;
                }
            }
            return returnValue;
        }
    }
    getAvailableMoves(): Move[] {
        /**
         * Analyzing current game state it will return an array of possible moves
         */
        let arrayToReturn:Move[] = [];

        let currentArray:number[][] = [[0,0,0],[0,0,0],[0,0,0]];

        for(let i:number = 0; i< 3 ; i++){
            for(let j:number = 0; j<3 ; j++){
                currentArray[i][j] = super.get(i, j);
            }
        }

        for (let i: number = 0; i < 3; i++) {
            for (let j: number = 0; j < 3; j++) {
                if(!currentArray[i][j]){
                    arrayToReturn.push(new Move(i, j))
                }
            }
        }
        return arrayToReturn;
    }
    getNewState(i:number, j:number): Game {
        /**
         * Given a possible move it will return the next game with that move considered and the player switched
         */
        let currentArray:number[][] = [[0,0,0],[0,0,0],[0,0,0]];

        for(let i:number = 0; i< 3 ; i++){
            for(let j:number = 0; j<3 ; j++){
                currentArray[i][j] = super.get(i, j);
            }
        }
        currentArray[i][j] = super.getPlayer();
        let nextState:Game;
        if(super.getPlayer() === 1){
            nextState = new Game("", Board.playerB);
        }else{
            nextState = new Game("", Board.playerA);
        }
        nextState.setArray(currentArray);
        return nextState;
    }

    win(): number {
        /**
         * This method is checked after isOver() returns true, this one will return which player won (ref: ./board.ts)
         * and in case it was a draw it'll return 0
         */
        let currentArray:number[][] = super.getArray();
        let returnValue: number = 0;
        if(currentArray[0][0] === currentArray[1][1] && currentArray[1][1] === currentArray[2][2] && currentArray[0][0])
            return currentArray[0][0]
        else if(currentArray[0][2] === currentArray[1][1] && currentArray[1][1] === currentArray[2][0] && currentArray[0][2])
            return currentArray[0][2]
        else{
            for(let i: number = 0; i < 3 && !returnValue; i++) {
                if (currentArray[i][0] === currentArray[i][1] &&  currentArray[i][1] === currentArray[i][2] && currentArray[i][0]){
                    returnValue = currentArray[i][0];
                }
                if (currentArray[0][i] === currentArray[1][i] &&  currentArray[1][i] === currentArray[2][i] && currentArray[0][i]){
                    returnValue = currentArray[0][i];
                }
            }
            return returnValue;
        }
    }
    
    static score(game:Game, depth:number): number {
        if(game.win() === Board.playerA){
            return 10 - depth;
        }else if(game.win() === Board.playerB){
            return depth - 10;
        }else{
            return 0;
        }
    }

}