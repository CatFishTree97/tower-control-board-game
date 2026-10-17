/* eslint-disable @typescript-eslint/no-unused-vars */
/* Problem 7

ActionMove represents an action the player can make where the start
piece is moved to an empty square on the board.

7.1 Define a class named ActionMove that extends ActionStartEnd 
(we need to specify both the start and end locations) 

- Define the constructor with ONLY the game and the location parameters 
   required by the superclass.
   Constructor should call the super's constructor with the arguments
   set to meet a move's requirements.
   Note: the second argument for the super class call should be the ActionType. 
   We don't need this value passed to our constructor because it will
   always represent a Move.
   The location parameters are to be determined by a Move action. 
   (Should the end square be empty or have a piece? 
   Should the end piece (if required) belong to the current team or the opponent team?)          

7.2 Implement method performAction. This method will carry out the
    move on the GameBoard. 

    First - check that this is a valid action the player can make.
    If the action is not valid - throw an ActionError and pass:
        - the Game's message (this was set in the validAction method)
        - the appropriate ActionType

    If the action is valid - implement the logic to reflect a move made in the 
    game. 
    On a move:  
        - the Piece on the Start Square is moved to the End Square   
        - the Piece speaks
        - the turn of the game is changed to the other player
   

    Note: Use  your UML diagram to take advantage of the methods you 
    already created in Part A! This method should not require a lot of coding
    other than to call methods you've already written. 

    Test your ActionMove with ActionMove.test.ts 
    View the output of the gameboard to see your piece move
*/

import { Game } from "../elements/Game";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { PieceJudge } from "../elements/PieceJudge";
import { ActionStartEnd } from "./ActionStartEnd";
import { ActionType } from "../elements/Utilities";
import { ActionError } from "../ActionError";

export class ActionMove extends ActionStartEnd {
    constructor(
        game: Game,
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ) {
        super(game, ActionType.Move, startLocation, endLocation, true, true);
    }

    public validAction(): boolean {
        if (super.validAction()) {
            let performingPiece = this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece();
            if (performingPiece instanceof PieceJudge) {
                if (
                    this.game
                        .getRestrictedSpaces()
                        .includes(
                            this.game
                                .getGameBoard()
                                .getSquare(this.endLocation),
                        )
                ) {
                    this.game.setMessage(
                        "Impartiality: Judges cannot move to the two most recently occupied spaces.",
                    );
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    public performAction(): boolean {
        if (this.validAction()) {
            this.game
                .getGameBoard()
                .getSquare(this.endLocation)
                .setPiece(
                    this.game
                        .getGameBoard()
                        .getSquare(this.startLocation)
                        .getPiece(),
                );
            this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .setPiece(null);
            this.game
                .getGameBoard()
                .getSquare(this.endLocation)
                .getPiece()
                ?.speak();
            this.game.addRestrictedSpace(
                this.game.getGameBoard().getSquare(this.startLocation),
            );
            this.game.changeTurn();
        } else {
            throw new ActionError(this.game.getMessage(), ActionType.Move);
        }
        return true;
    }
}
