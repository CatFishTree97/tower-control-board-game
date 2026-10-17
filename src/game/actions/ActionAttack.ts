/* eslint-disable @typescript-eslint/no-unused-vars */
/* Problem 9

ActionAttack represents an action the player can make where the start
piece attacks an opponents piece on the end square. The attacking piece
moves to the end square. The attacked piece is removed from the board
and set to inactive. 

9.1 Define a class named ActionAttack that extends ActionStartEnd 
(We need to specify both the start and end locations) 

- Define the constructor with ONLY the game and the location parameters 
   required by the superclass.
   Constructor should call the super's constructor with the arguments
   set to meet an attack's requirements.
   Note: the second argument for the super class call should be the ActionType. 
   We don't need this value passed to our constructor because it will
   always represent an Attack. 
   The location parameters are to be determined by an Attack action. 
   (Should the end square be empty or have a piece? 
   Should the end piece (if required) belong to the current team or the opponent team?)   

9.2 Implement method performAction. This method will carry out the
    attack action on the GameBoard. 

    First - check that this is a valid action the player can make.
    If the action is not valid - throw an ActionError and pass:
        - the Game's message (this was set in the validAction method)
        - the appropriate ActionType.

    If the action is valid - implement the logic to reflect an attack was made in the 
    game.   
    On an attack:
    - the Piece on the End Square is removed from the board
          UNLESS it is a ghost that is not dormant!
            - ghosts that are not dormant will change to dormant and stay on the board
                on their first attack
    - the Piece on the End Square is set to inactive
    - Piece on the Start Square is moved to the End Square
    - update the action for the Piece doing the attacking
    - the Piece being attacked speaks
    - the turn of the game is changed to the other player

    Note: Use  your UML diagram to take advantage of the methods you 
    already created in Part A! This method should not require a lot of coding
    other than to call methods you've already written. 

    Test your ActionAttack with ActionAttack.test.ts 
    View the output of the gameboard to see a piece attack
*/

import { Game } from "../elements/Game";
import { ActionType } from "../elements/Utilities";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { ActionStartEnd } from "./ActionStartEnd";
import { PieceGhost } from "../elements/PieceGhost";
import { PieceJudge } from "../elements/PieceJudge";
import { ActionError } from "../ActionError";
import { BoardSquare } from "../elements/BoardSquare";

export class ActionAttack extends ActionStartEnd {
    constructor(
        game: Game,
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ) {
        super(
            game,
            ActionType.Attack,
            startLocation,
            endLocation,
            false,
            false,
        );
    }
    public validAction(): boolean {
        if (super.validAction()) {
            let affectedPiece = this.game
                .getGameBoard()
                .getSquare(this.endLocation)
                .getPiece()!;
            let endSpace: BoardSquare = this.game
                .getGameBoard()
                .getSquare(this.endLocation);
            if (this.game.getOpponentTeam().isGuarding()) {
                this.game.setMessage("The opposing team is guarding");
                return false;
            }
            if (affectedPiece instanceof PieceJudge) {
                if (
                    affectedPiece instanceof PieceJudge &&
                    this.game.getTurnNumber() <= affectedPiece.getTenure() &&
                    !endSpace.isTowerControl()
                    //Tenure does not apply if a Judge piece is standing on a Tower Control Square for GameBDB
                ) {
                    this.game.setMessage(
                        `This Judge has a tenure of ${Math.floor(affectedPiece.getTenure() / 2)} rounds.`,
                    );
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
        return false;
    }

    public performAction(): boolean {
        if (!this.validAction()) {
            throw new ActionError(this.game.getMessage(), ActionType.Attack);
        } else {
            let attackedPiece = this.game
                .getGameBoard()
                .getSquare(this.endLocation)
                .getPiece();
            attackedPiece?.speak();
            if (
                attackedPiece instanceof PieceGhost &&
                !attackedPiece.isDormant()
            ) {
                attackedPiece.changeDormant(true);
                this.game
                    .getGameBoard()
                    .getSquare(this.startLocation)
                    .getPiece()
                    ?.updateAction(ActionType.Attack);
            } else {
                attackedPiece?.setActive(false);
                this.game
                    .getGameBoard()
                    .getSquare(this.endLocation)
                    .removePiece();
                if (attackedPiece instanceof PieceGhost) {
                    attackedPiece.setOnBoard(false);
                }
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
                    ?.updateAction(ActionType.Attack);
            }
            this.game.changeTurn();
            return true;
        }
    }
}
