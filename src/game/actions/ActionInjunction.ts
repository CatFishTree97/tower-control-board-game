/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Game } from "../elements/Game";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { PieceJudge } from "../elements/PieceJudge";
import { ActionStart } from "./ActionStart";
import { ActionType } from "../elements/Utilities";
import { ActionError } from "../ActionError";

export class ActionInjunction extends ActionStart {
    constructor(game: Game, startLocation: BoardLocation) {
        super(game, ActionType.Injunction, startLocation);
    }

    public validAction(): boolean {
        if (super.validAction()) {
            if (
                this.game.getTurnNumber() >=
                this.game.getCurrentTeam().getCannotInjunctionAgainUntil()
            ) {
                return true;
            } else {
                this.game.setMessage(
                    `You cannot perform this action again for one more turn.`,
                );
                return false;
            }
        } else {
            return false;
        }
    }

    public performAction(): boolean {
        if (this.validAction()) {
            let actionList: ActionType[] = [
                ActionType.Attack,
                ActionType.Injunction,
                ActionType.Move,
                ActionType.Recruit,
                ActionType.Renew,
                ActionType.Revive,
                ActionType.Spawn,
                ActionType.Swap,
                ActionType.Guard,
            ];
            let abilityA = Math.floor(Math.random() * 9);
            let abilityB = Math.floor(Math.random() * 9);
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
            if (abilityA === abilityB) {
                for (let i: number = 0; abilityA === abilityB; i++) {
                    abilityB = Math.floor(Math.random() * 8);
                }
            }
            this.game
                .getCurrentTeam()
                .logInjunction(this.game.getTurnNumber() + 4);
            this.game.addInjunctions([
                actionList[abilityA],
                actionList[abilityB],
            ]);
            this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece()
                ?.updateAction(ActionType.Injunction);
            this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece()
                ?.speak();
            try {
                alert(
                    `An injunction has been created. The ${this.game.getOpponentTeam().getTeamColor()} team won't be able to ${actionList[abilityA].valueOf()} or ${actionList[abilityB].valueOf()} for one round.`,
                );
                //https://www.w3schools.com/jsref/met_win_alert.asp
            } catch (error) {
                console.log(error);
            }
            if (
                !(
                    this.game
                        .getGameBoard()
                        .getSquare(this.startLocation)
                        .getPiece() instanceof PieceJudge
                )
            ) {
                this.game.changeTurn();
            } else {
                this.game.takeHalfTurn();
            }
            return true;
        } else {
            throw new ActionError(
                this.game.getMessage(),
                ActionType.Injunction,
            );
        }
    }
}
