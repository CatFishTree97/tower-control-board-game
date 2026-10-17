/* eslint-disable @typescript-eslint/no-unused-vars */
import { Game } from "../elements/Game";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { PieceJudge } from "../elements/PieceJudge";
import { ActionStart } from "./ActionStart";
import { ActionType } from "../elements/Utilities";
import { ActionError } from "../ActionError";

export class ActionPass extends ActionStart {
    constructor(game: Game, startLocation: BoardLocation) {
        super(game, ActionType.Pass, startLocation);
    }

    public performAction(): boolean {
        if (this.validAction()) {
            this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece()!
                .speak();
            this.game.changeTurn();
            return true;
        } else {
            throw new ActionError(this.game.getMessage(), ActionType.Pass);
        }
    }
}
