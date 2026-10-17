/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* Problem 8

ActionSpawn represents an action the player can make where the start
piece selected to spawn another piece that gets placed on the board
in a random empty square on the board.

8.1 Define a class named ActionSpawn that extends ActionStart (We don't
need to specify an End location) and represents a 'spawn' action. 

- Define the constructor with ONLY the game and the location parameter
   required by the superclass
   Constructor should call the super's constructor with the arguments
   set to meet a spawn's requirements.
   Note: the second argument for the super class call should be the ActionType. 
   We don't need this value passed to our constructor because it will
   always represent a Spawn.
   The location parameter are to be determined by actions of a Spawn. 
   

8.2 Override the method valid Action. There is an additional requirement
    that should be met. Since we are creating a new piece - we must 
    make sure there is room on the board for this new piece. Using
    good OOP practices, this method should check that this action
    meets all the requirements in ActionStart as well as this 
    additional requirement.

8.3 Implement method performAction. This method will carry out the
    spawn on the GameBoard. 
    
    First - check that this is a valid action the player can make.
    If the action is not valid - throw an ActionError and pass:
        - the Game's message (this was set in the validAction method)
        - the appropriate ActionType.

    If the action is valid - implement the logic to reflect a spawn made in the 
    game. 
    On a spawn:  
        - the Piece on the Start Square is spawned 
        - update the action for the Piece on start square
        - the spawn is placed on a random empty square and added to the current team    
        - one of the pieces speaks
        - the turn of the game is changed to the other player

    Note: Use  your UML diagram to take advantage of the methods you 
    already created in Part A! This method should not require a lot of coding
    other than to call methods you've already written. 

    Test your ActionSpawn with ActionSpawn.test.ts 
    View the output of the gameboard to see a piece spawn

*/

import { Game } from "../elements/Game";
import { ActionType } from "../elements/Utilities";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { BoardSquare } from "../elements/BoardSquare";
import { ActionStart } from "./ActionStart";
import { ActionError } from "../ActionError";
import { PieceJudge } from "../elements/PieceJudge";
import { PieceBlueHen } from "../elements/PieceBlueHen";
import { PieceGhost } from "../elements/PieceGhost";
import { PieceMinion } from "../elements/PieceMinion";

export class ActionSpawn extends ActionStart {
    constructor(game: Game, startLocation: BoardLocation) {
        super(game, ActionType.Spawn, startLocation);
    }

    public validAction(): boolean {
        if (!super.validAction()) {
            return false;
        }
        if (this.game.getGameBoard().isBoardFull()) {
            this.game.setMessage("Board must not be full.");
        }
        return true;
    }

    public performAction(): boolean {
        if (!this.validAction()) {
            throw new ActionError(this.game.getMessage(), ActionType.Spawn);
        } else {
            let startSquare: BoardSquare = this.game
                .getGameBoard()
                .getSquare(this.startLocation);
            let newPiece: Piece | null = this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece()!
                .spawn();
            this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece()
                ?.updateAction(ActionType.Spawn);
            if (newPiece instanceof PieceJudge) {
                newPiece.increaseTenure(this.game.getTurnNumber());
            }
            let emptySquare = this.game.getGameBoard().findRandomEmptySquare();
            let loop = true;
            while (loop) {
                loop = false;
                if (newPiece instanceof PieceMinion) {
                    if (
                        startSquare.getSquareColor() ===
                        emptySquare.getSquareColor()
                    ) {
                        emptySquare = this.game
                            .getGameBoard()
                            .findRandomEmptySquare();
                        loop = true;
                    }
                } else if (newPiece instanceof PieceGhost) {
                    if (
                        this.game
                            .getGameBoard()
                            .sameRow(startSquare, emptySquare)
                    ) {
                        emptySquare = this.game
                            .getGameBoard()
                            .findRandomEmptySquare();
                        loop = true;
                    }
                } else if (newPiece instanceof PieceBlueHen) {
                    if (
                        this.game
                            .getGameBoard()
                            .sameColumn(startSquare, emptySquare)
                    ) {
                        emptySquare = this.game
                            .getGameBoard()
                            .findRandomEmptySquare();
                        loop = true;
                    }
                }
            }
            this.game.getCurrentTeam().addPieceToTeam(newPiece);
            emptySquare.setPiece(newPiece);
            emptySquare.getPiece()?.speak();
            emptySquare.getPiece()?.updateAction(ActionType.Spawn);
            this.game.changeTurn();
        }
        return true;
    }
}
