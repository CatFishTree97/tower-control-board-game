/* eslint-disable @typescript-eslint/no-unused-vars */
/*Problem 3

ActionRevive represents an action the player can make where the start
piece carrying this ability can revive all dormant ghosts that are 
on its own team and still on the board. The dormant ghosts are no longer 
dormant and they are moved to a new random location on the board.

3.1 Define a class named ActionRevive that extends ActionStart
(We don't need to specify an End location) 

- Define the constructor with ONLY the game and the location parameters 
   required by the superclass.
   Constructor should call the super's constructor with the arguments
   set to meet Revive's requirements.
   Note: the second argument for the super class call should be the ActionType. 
   We don't need this value passed to our constructor because it will
   always represent an Attack. 
   

3.2 Override the method valid Action. There is an additional requirement
    that should be met. Since we are moving a ghost piece to a random
    location - we must make sure there is room on the board to do this.
    Using good OOP practices, this method should check that this action
    meets all the requirement for all ActionStarts as well as this 
    additional requirement.

3.3 Implement method performAction. This method will carry out the
    revive action on the GameBoard. 

    First - check that this is a valid action the player can make.
    If the action is not valid - throw an ActionError and pass:
        - the Game's message (this was set in the validAction method)
        - the appropriate ActionType.

    If the action is valid - implement the logic to reflect a revive was made in the 
    game. 
        On a revive:
        - all the pieces on the board that are dormant ghosts
            belonging to the current team - are brought back to life
            and no longer dormant 
            NOTE: changeDormant should be public in PieceGhost (I had a typo
            in the instructions for this piece class)
        - these revived ghost pieces are moved to a random empty spot on the board
        - update the action for the Piece on start square
        - one of the Pieces being speaks
        - the turn of the game is changed to the other player

    Note: Use  your UML diagram to take advantage of the methods you 
    already created in Part A! This method should not require a lot of coding
    other than to call methods you've already written. 

    Test your ActionRevive with ActionRevie.test.ts 
    View the output of the gameboard to see a piece revive their dormant ghosts
*/

import { Game } from "../elements/Game";
import { ActionType } from "../elements/Utilities";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { ActionStart } from "./ActionStart";
import { PieceGhost } from "../elements/PieceGhost";
import { ActionError } from "../ActionError";
import { BoardSquare } from "../elements/BoardSquare";

export class ActionRevive extends ActionStart {
    constructor(game: Game, startLocation: BoardLocation) {
        super(game, ActionType.Revive, startLocation);
    }

    public getAllDormantGhostsOfCurrentTeam(): PieceGhost[] {
        let ghosts: PieceGhost[] = [];
        for (let row of this.game.getGameBoard().getAllSquares()) {
            for (let square of row) {
                if (square.getPiece()) {
                    let piece = square.getPiece();
                    if (piece instanceof PieceGhost) {
                        if (
                            piece.isDormant() &&
                            piece.getTeamColor() ===
                                this.game.getCurrentTeam().getTeamColor()
                        ) {
                            ghosts.push(piece);
                        }
                    }
                }
            }
        }
        return ghosts;
    }

    public validAction(): boolean {
        if (super.validAction()) {
            if (
                this.getAllDormantGhostsOfCurrentTeam().length <=
                this.game.getGameBoard().getNumberOfEmptySquares()
            ) {
                return true;
            } else {
                this.game.setMessage(
                    `There must be at least ${this.getAllDormantGhostsOfCurrentTeam().length} empty space(s) on the board to perform this action.`,
                );
                return false;
            }
        } else {
            return false;
        }
    }

    public performAction(): boolean {
        if (super.validAction() && this.validAction()) {
            let ghosts: PieceGhost[] = [];
            for (let ghost of this.getAllDormantGhostsOfCurrentTeam()) {
                ghosts.push(ghost);
            }
            for (
                let row: number = 0;
                row < this.game.getGameBoard().getNumRows();
                row++
            ) {
                for (
                    let col: number = 0;
                    col < this.game.getGameBoard().getNumColumns();
                    col++
                ) {
                    let square: BoardSquare = this.game
                        .getGameBoard()
                        .getAllSquares()[row][col];
                    if (!square.isEmpty()) {
                        if (square.getPiece() instanceof PieceGhost) {
                            if (!square.getPiece()?.isActive())
                                if (
                                    square.getPiece()?.getTeamColor() ===
                                    this.game.getCurrentTeam().getTeamColor()
                                ) {
                                    square.removePiece();
                                }
                        }
                    }
                }
            }
            for (let ghost of ghosts) {
                ghost.changeDormant(false);
                ghost.setActive(true);
                let square = this.game.getGameBoard().findRandomEmptySquare();
                square.setPiece(ghost);
            }
            let performingPiece = this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece()!;
            performingPiece.updateAction(ActionType.Revive);
            performingPiece.speak();
            this.game.changeTurn();
            return true;
        } else {
            throw new ActionError(this.game.getMessage(), ActionType.Revive);
        }
    }
}
