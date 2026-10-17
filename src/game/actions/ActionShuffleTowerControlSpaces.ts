/* eslint-disable @typescript-eslint/no-unused-vars */
import { GameBDB } from "../elements/GameBDB";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { PieceJudge } from "../elements/PieceJudge";
import { ActionStart } from "./ActionStart";
import { ActionType } from "../elements/Utilities";
import { ActionError } from "../ActionError";

export class ActionShuffleTowerControlSpaces extends ActionStart {
    //This ability changes which board spaces are the tower control squarse. It is included in the pool of abilities that can be randomly added to each piece's backpack at the start of the game if the game is of type GameBDB.
    constructor(game: GameBDB, startLocation: BoardLocation) {
        super(game, ActionType.ShuffleTowerControlSpaces, startLocation);
    }

    public performAction(): boolean {
        if (this.validAction()) {
            let game = this.game;
            game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece()
                ?.updateAction(ActionType.ShuffleTowerControlSpaces);
            game.getGameBoard()
                .getSquare(this.startLocation)
                .getPiece()!
                .speak();
            if (game instanceof GameBDB) {
                game.shuffleTowerControlSpaces();
            }
            game.changeTurn();
            return true;
        } else {
            throw new ActionError(
                this.game.getMessage(),
                ActionType.ShuffleTowerControlSpaces,
            );
        }
    }
}
