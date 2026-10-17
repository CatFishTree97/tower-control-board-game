/* eslint-disable @typescript-eslint/no-unused-vars */
import { Game } from "../elements/Game";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { PieceJudge } from "../elements/PieceJudge";
import { ActionStart } from "./ActionStart";
import { ActionType } from "../elements/Utilities";
import { ActionError } from "../ActionError";

export class ActionGuard extends ActionStart {
    //This ability stops the team who uses it from being attacked for one round. It is included in the pool of abilities that can be randomly added to each piece's backpack at the start of the game.
    constructor(game: Game, startLocation: BoardLocation) {
        super(game, ActionType.Guard, startLocation);
    }

    public validAction(): boolean {
        if (this.game.getCurrentTeam().isGuarding()) {
            this.game.setMessage("You are already guarding.");
            return false;
        } else {
            return super.validAction();
        }
    }

    public performAction(): boolean {
        if (this.validAction()) {
            this.game.getCurrentTeam().guard();
            this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece()
                ?.updateAction(ActionType.Guard);
            this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece()!
                .speak();
            this.game.changeTurn();
            return true;
        } else {
            throw new ActionError(this.game.getMessage(), ActionType.Guard);
        }
    }
}
