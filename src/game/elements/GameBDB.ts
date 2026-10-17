/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { BoardSquare } from "./BoardSquare";
import { Piece } from "./Piece";
import { ActionPass } from "../actions/ActionPass";
import { ActionType } from "./Utilities";

export class GameBDB extends Game {
    //At the beginning of the game, two random empty spaces are chosen as tower control spaces.
    //Every turn, if both tower control spaces are occupied by team A, the score will increase by 1. If they are both occupied by team B, the score decreases by 1.
    //If neither space is occupied, the score moves closer to 0.
    //If the score reaches +5, team A wins. If it reaches -5, team B wins.
    //If both team's piece counts reach 1 or less, the team who got closest to winning is declared the winner.
    //If both teams came equally close to winning, the last team to still have pieces reamining on the board will become the winner.
    protected type = "GameBDB";
    private score: number = 0;
    private towerControlSquares!: BoardSquare[];
    //https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html
    private greatestTeamAScore: number = 0;
    private greatestTeamBScore: number = 0;
    private teamASummonCountUp = 0;
    private teamBSummonCountUp = 0;

    constructor(board: GameBoard, teamA: Team, teamB: Team, turn: Team) {
        super(board, teamA, teamB, turn);
    }

    public getScore(): number {
        return this.score;
    }

    private setTowerControlSquares(): void {
        if (!this.towerControlSquares) {
            this.towerControlSquares = [];
        }
        let continueLoop: boolean = true;
        let squareA: BoardSquare = this.board.findRandomEmptySquare();
        squareA.setTowerControl(true);
        this.towerControlSquares.push(squareA);
        while (continueLoop) {
            let squareB: BoardSquare = this.board.findRandomEmptySquare();
            if (!squareB.isTowerControl()) {
                squareB.setTowerControl(true);
                this.towerControlSquares.push(squareB);
                continueLoop = false;
            }
        }
    }

    public shuffleTowerControlSpaces(): void {
        if (!this.towerControlSquares) {
            this.towerControlSquares = [];
        }
        for (let square of this.towerControlSquares) {
            square.setTowerControl(false);
        }
        this.towerControlSquares = [];
        this.setTowerControlSquares();
    }

    protected initializeGameBoard(): void {
        super.initializeGameBoard();
        this.setTowerControlSquares();
    }

    public changeTurn(): void {
        super.changeTurn();

        if (this.getCurrentTeam() === this.teamA) {
            if (
                this.teamA.filterPieces(true).length <
                this.teamB.filterPieces(true).length
            ) {
                if (
                    (!this.teamA.hasPieceAdditionAbilities() &&
                        (this.score < 0 || this.getTurnNumber() > 7 * 2)) ||
                    Math.abs(
                        this.teamB.filterPieces(true).length -
                            this.teamA.filterPieces(true).length,
                    ) > 1
                ) {
                    this.teamASummonCountUp++;
                }
            }
            if (this.score <= -5) {
                this.teamASummonCountUp++;
            }
        }
        if (this.getCurrentTeam() === this.teamB) {
            if (
                this.teamB.filterPieces(true).length <
                this.teamA.filterPieces(true).length
            ) {
                if (
                    (!this.teamB.hasPieceAdditionAbilities() &&
                        (this.score < 0 || this.getTurnNumber() > 7 * 2)) ||
                    Math.abs(
                        this.teamB.filterPieces(true).length -
                            this.teamA.filterPieces(true).length,
                    ) > 1
                ) {
                    this.teamBSummonCountUp++;
                }
            }
            if (this.score >= 5) {
                this.teamBSummonCountUp++;
            }
        }

        let pieces: Piece[] = [];
        for (let square of this.towerControlSquares) {
            if (!square.isEmpty()) {
                pieces.push(square.getPiece()!);
            }
        }

        if (
            this.teamASummonCountUp >= 3 &&
            this.teamA.filterPieces(true).length
        ) {
            if (this.teamA.findPieceWithAbility(ActionType.Summon)) {
                this.teamA
                    .findPieceWithAbility(ActionType.Summon)
                    ?.getBackpack()
                    .renewOrGrantAbility(ActionType.Summon);
            } else {
                let pieceNumber: number = Math.floor(
                    Math.random() * this.teamA.filterPieces(true).length,
                );
                let piece: Piece = this.teamA.filterPieces(true)[pieceNumber];
                piece.getBackpack().renewOrGrantAbility(ActionType.Summon);
            }
            try {
                alert(
                    `Because ${this.teamA.getTeamColor()} team is down on their luck, they have been given a free summon action.`,
                );
                //https://www.w3schools.com/jsref/met_win_alert.asp
            } catch (error) {
                console.log(error);
            }
            this.teamASummonCountUp = 0;
        }
        if (
            this.teamBSummonCountUp >= 3 &&
            this.teamB.filterPieces(true).length
        ) {
            if (this.teamB.findPieceWithAbility(ActionType.Summon)) {
                this.teamB
                    .findPieceWithAbility(ActionType.Summon)
                    ?.getBackpack()
                    .renewOrGrantAbility(ActionType.Summon);
            } else {
                let pieceNumber: number = Math.floor(
                    Math.random() * this.teamB.filterPieces(true).length,
                );
                let piece: Piece = this.teamB.filterPieces(true)[pieceNumber];
                piece.getBackpack().renewOrGrantAbility(ActionType.Summon);
            }
            try {
                alert(
                    `Because ${this.teamB.getTeamColor()} team is down on their luck, they have been given a free summon action.`,
                );
                //https://www.w3schools.com/jsref/met_win_alert.asp
            } catch (error) {
                console.log(error);
            }
            this.teamBSummonCountUp = 0;
        }

        if (pieces.length >= 2) {
            if (
                this.teamA.getAllPieces().includes(pieces[0]) &&
                this.teamA.getAllPieces().includes(pieces[1])
            ) {
                this.score++;
            } else if (
                this.teamB.getAllPieces().includes(pieces[0]) &&
                this.teamB.getAllPieces().includes(pieces[1])
            ) {
                this.score--;
            }
        } else {
            if (this.score > 0) {
                this.score--;
            } else if (this.score < 0) {
                this.score++;
            }
        }
        if (this.score > 0 && this.score > this.greatestTeamAScore) {
            this.greatestTeamAScore = this.score;
        } else if (
            this.score < 0 &&
            Math.abs(this.score) > this.greatestTeamBScore
        ) {
            this.greatestTeamBScore = Math.abs(this.score);
        }
    }

    public isGameEnded(): boolean {
        return (
            this.score >= 10 ||
            this.score <= -10 ||
            (this.teamA.filterPieces(true).length <= 1 &&
                !this.teamA.hasPieceAdditionAbilities() &&
                this.teamB.filterPieces(true).length <= 1 &&
                !this.teamB.hasPieceAdditionAbilities() &&
                (this.greatestTeamAScore != this.greatestTeamBScore ||
                    this.teamA.filterPieces(true).length === 0 ||
                    this.teamB.filterPieces(true).length === 0))
        );
    }

    public getWinner(): Team {
        if (this.score >= 10) {
            return this.teamA;
        } else if (this.score <= -10) {
            return this.teamB;
        } else if (this.greatestTeamAScore > this.greatestTeamBScore) {
            return this.teamA;
        } else if (this.greatestTeamAScore < this.greatestTeamBScore) {
            return this.teamB;
        } else if (this.teamA.filterPieces(true).length > 0) {
            return this.teamA;
        } else {
            return this.teamB;
        }
    }
}
