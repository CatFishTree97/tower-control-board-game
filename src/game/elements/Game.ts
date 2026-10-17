/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* Game Elements Part B
Problem 1

1.1 Create a new abstract class named Game. 
This class should have the following members:
- a member field for the GameBoard
- a member field for team A
- a member field for team B
- a member field turn of type Team  that refers to the team that has the next turn
- a member field of type string for a message to hold the status of our game

- constructor with the first 4 parameters listed above in that order -
    it should
        - set these fields
        - set the message string to "Ready"
        - call initializeGameBoard to set up the GameBoard with 
                pieces on it  - this method is in the next instruction.

1.2 A private method name initializeGameBoard that has no parameters 
   and doesn't return a value. This method should
   set up both Team’s pieces randomly on the board
   Add a call to this method to your constuctor.
   Hint: use your findRandomEmptySquare method in your GameBoard class
   You should write your algorithm for this method before coding it!!
   This is very similar to a method we wrote in the In Class Activity Week 2!

1.3 The acessor methods:
    - getGameBoard,  getMessage

1.4 A method named getCurrentTeam that has no parameters and 
returns the Team team whose turn it is 
    - 
1.5 A method named getOpponentTeam that has no parameters and
returns the Team whose turn it isn’t 

1.6 A method named isTurn that has one Team parameter and returns a 
          boolean representing whether it is this Team’s turn 

1.7 A method named changeTurn that has no parameters and doesn't return
a value. This method sets the member field 'turn' to the other Team

1.8 A setter method
    setMessage

1.9 An abstract method named isGameEnded that has no parameters 
and returns a boolean.

1.10 An abstract method named getWinner that has no parameters 
and returns a Team.

1.11 A toString method is already defined for you.

- Complete GameS26 before testing.

*/

import { GameBoard } from "./GameBoard";
import { Team } from "./Team";
import { BoardSquare } from "./BoardSquare";
import { ActionType, BoardLocation } from "./Utilities";

export abstract class Game {
    protected abstract type: string;
    protected board: GameBoard;
    protected teamA: Team;
    protected teamB: Team;
    private turn: Team;
    private notTurn: Team;
    private status: string;
    private turnNumber = 1;
    private teamAInjunctions: ActionType[] = [];
    private teamAInjunctionsLastUntil: number[] = [];
    private teamBInjunctions: ActionType[] = [];
    private teamBInjunctionsLastUntil: number[] = [];
    private restrictedSpaces: BoardSquare[] = [];
    private halfTurn: boolean = false;

    constructor(board: GameBoard, teamA: Team, teamB: Team, turn: Team) {
        this.board = board;
        this.teamA = teamA;
        this.teamB = teamB;
        this.turn = turn;
        this.notTurn = teamB;
        this.status = "ready";
        this.initializeGameBoard();
    }

    public getType(): string {
        return this.type;
    }

    public takeHalfTurn(): void {
        if (this.halfTurn) {
            this.changeTurn();
        } else {
            this.halfTurn = true;
        }
    }

    public getInjunctions(): ActionType[] {
        if (this.getCurrentTeam() === this.teamA) {
            return this.teamAInjunctions;
        } else {
            return this.teamBInjunctions;
        }
    }

    protected initializeGameBoard(): void {
        for (let piece of this.teamA.getAllPieces()) {
            this.board.findRandomEmptySquare().setPiece(piece);
        }
        for (let piece of this.teamB.getAllPieces()) {
            this.board.findRandomEmptySquare().setPiece(piece);
        }
    }

    public getRestrictedSpaces(): BoardSquare[] {
        return this.restrictedSpaces;
    }

    public addRestrictedSpace(space: BoardSquare) {
        this.restrictedSpaces.push(space);
        if (this.restrictedSpaces.length > 2) {
            this.restrictedSpaces.shift();
        }
    }

    public getGameBoard(): GameBoard {
        return this.board;
    }

    public getMessage(): string {
        return this.status;
    }

    public getCurrentTeam(): Team {
        return this.turn;
    }

    public getOpponentTeam(): Team {
        return this.notTurn;
    }

    public isTurn(team: Team): boolean {
        return team === this.turn;
    }

    public getTurnNumber(): number {
        return this.turnNumber;
    }

    public changeTurn(): void {
        this.halfTurn = false;
        this.turnNumber++;
        if (this.teamAInjunctionsLastUntil.includes(this.turnNumber)) {
            this.teamAInjunctions.shift();
            this.teamAInjunctions.shift();
        }
        if (this.teamBInjunctionsLastUntil.includes(this.turnNumber)) {
            this.teamBInjunctions.shift();
            this.teamBInjunctions.shift();
        }
        let temp = this.turn;
        this.turn = this.getOpponentTeam();
        this.notTurn = temp;
        this.getCurrentTeam().unguard();
    }

    public addInjunctions(actions: ActionType[]): void {
        if (this.getOpponentTeam() === this.teamA) {
            this.teamAInjunctions = this.teamAInjunctions.concat(actions);
            this.teamAInjunctionsLastUntil.push(this.turnNumber + 2);
        } else {
            this.teamBInjunctions = this.teamBInjunctions.concat(actions);
            this.teamBInjunctionsLastUntil.push(this.turnNumber + 2);
        }
    }

    public setMessage(message: string) {
        this.status = message;
    }

    abstract isGameEnded(): boolean;

    abstract getWinner(): Team;

    toString(): string {
        let retString: string = "";
        retString = retString.concat("\n" + this.getGameBoard().toString());
        retString = retString.concat(
            "\n" + this.getCurrentTeam().toString() + "\n",
        );
        retString = retString.concat(
            "\n" + this.getOpponentTeam().toString() + "\n",
        );
        retString = retString.concat(
            "\nIt is Team " + this.turn.getTeamColor() + "'s turn\n",
        );
        return retString.toString();
    }
}
