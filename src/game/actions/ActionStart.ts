/* eslint-disable no-unexpected-multiline */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* Problem 5
Abstractly represents the actions a player can take.
 where the player must select the start location.

5.1 Create an abstract class named ActionStart that
extends Action with the additional member field:
- member field for the location of the start square
- constructor with 3 parameters that
    - calls the super to set its two member fields 
    - sets the start location member field
5.2 Override the method validAction with no parameters and 
    returns a boolean representing whether the action is valid.
    For all actions that require a start piece in our game the following
    requirements must be true:
        - the location must be in bounds of the board       
        - there must be a piece on the start location
        - the piece on the start must belong to the current team
        - the piece on the start must be allowed to take that actions
    If any of these requirements are not met:
        - call the Game's setMessage and set the message the appropriate message:
                "Start square out of bounds."
                "No Piece on start square."
                "Piece on start square is not yours."
                "Piece on start square can't take that action."
        
    Note: Use your UML diagram to take advantage of the methods you 
    already created in Part A.  For example - the GameBoard class has a
    method to check if a location is in the bounds of the board.

- This class will be tested when you created more subclasses.

*/

import { BoardLocation } from "../elements/Utilities";
import { Game } from "../elements/Game";
import { Piece } from "../elements/Piece";
import { ActionType } from "../elements/Utilities";
import { Action } from "./Action";
import { ActionPass } from "./ActionPass";

export abstract class ActionStart extends Action {
    protected startLocation: BoardLocation;

    constructor(game: Game, type: ActionType, startLocation: BoardLocation) {
        super(game, type);
        this.startLocation = startLocation;
    }

    public validAction(): boolean {
        if (this.game.isGameEnded()) {
            this.game.setMessage(
                `Game has ended. Winner is ${this.game.getWinner()}`,
            );
            return false;
        }
        if (!this.game.getGameBoard().inBounds(this.startLocation)) {
            this.game.setMessage("Start square out of bounds.");
            return false;
        }
        if (
            !this.game
                .getGameBoard()
                .getAllSquares()
                [
                    this.startLocation.getRow()
                ][this.startLocation.getCol()].getPiece()
        ) {
            this.game.setMessage("No piece on start square.");
            return false;
        }
        if (
            !this.game
                .getCurrentTeam()
                .getAllPieces()
                .includes(
                    this.game
                        .getGameBoard()
                        .getAllSquares()
                        [
                            this.startLocation.getRow()
                        ][this.startLocation.getCol()].getPiece()!,
                )
        ) {
            this.game.setMessage("Piece on start square is not yours.");
            return false;
        }
        if (
            !this.game
                .getGameBoard()
                .getAllSquares()
                [
                    this.startLocation.getRow()
                ][this.startLocation.getCol()].getPiece()
                ?.allowableAction(this.type)
        ) {
            this.game.setMessage(
                "Piece on start square can't take that action.",
            );
            return false;
        }
        if (this.game.getInjunctions().includes(this.type)) {
            this.game.setMessage(
                "This action is currently restricted by an injunction.",
            );
            return false;
        }
        return true;
    }
}
