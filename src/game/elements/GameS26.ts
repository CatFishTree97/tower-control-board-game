/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* Problem 2:

2.1 Define a class named GameS26 that extends Game and 
represents the game we are developing.

This class should have the following members:

- constructor with the same number of parameters as its
   superclass. It should:
   - call the super class constructor
        
2.2 Implement isGameEnded method
    - for our game - the game has ended when either one or both teams
        has no ACTIVE pieces left on their team

2.3 Implement getWinner method
    - for our game the winner is the one that still has ACTIVE pieces 
        left on their team AFTER the game has ended.
        You can assume it will only be called if the game is ended.

- You can test your class with GameClasses.test.ts
*/

import { GameBoard } from "./GameBoard";
import { Team } from "./Team";
import { Game } from "./Game";

export class GameS26 extends Game {
    protected type = "GameS26";

    constructor(board: GameBoard, teamA: Team, teamB: Team, turn: Team) {
        super(board, teamA, teamB, turn);
    }

    public isGameEnded(): boolean {
        return (
            this.teamA.filterPieces(true).length === 0 ||
            this.teamB.filterPieces(true).length === 0
        );
    }

    public getWinner(): Team {
        if (this.teamA.filterPieces(true).length > 0) {
            return this.getCurrentTeam();
        } else {
            return this.teamB;
        }
    }
}
