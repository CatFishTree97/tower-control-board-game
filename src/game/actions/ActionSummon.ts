/* eslint-disable @typescript-eslint/no-unused-vars */
import { Game } from "../elements/Game";
import { ActionType } from "../elements/Utilities";
import { BoardLocation } from "../elements/Utilities";
import { Piece } from "../elements/Piece";
import { BoardSquare } from "../elements/BoardSquare";
import { ActionStart } from "./ActionStart";
import { ActionError } from "../ActionError";
import { PieceJudge } from "../elements/PieceJudge";
import { PieceBlueHen } from "../elements/PieceBlueHen";
import { PieceMinion } from "../elements/PieceMinion";
import { PieceGhost } from "../elements/PieceGhost";
import { Backpack } from "../elements/Backpack";
import { Ability } from "../elements/Ability";

export class ActionSummon extends ActionStart {
    private abilityOptions: ActionType[] = [
        ActionType.Spawn,
        ActionType.Renew,
        ActionType.Swap,
        ActionType.Revive,
        ActionType.Guard,
        ActionType.ShuffleTowerControlSpaces,
    ];

    constructor(game: Game, startLocation: BoardLocation) {
        super(game, ActionType.Summon, startLocation);
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
            throw new ActionError(this.game.getMessage(), ActionType.Summon);
        } else {
            let pieceNumber = Math.floor(Math.random() * 4);
            let newPiece: Piece | null = null;
            if (pieceNumber === 0) {
                newPiece = new PieceBlueHen();
            } else if (pieceNumber === 1) {
                newPiece = new PieceMinion();
            } else if (pieceNumber === 2) {
                newPiece = new PieceGhost();
            } else if (pieceNumber === 3) {
                newPiece = new PieceJudge();
            }
            let abilities: Ability[] = [];
            for (let j = 0; j < 3; j++) {
                if (Math.random() >= 0.5) {
                    abilities = abilities.concat([
                        new Ability(
                            this.abilityOptions[
                                Math.floor(
                                    Math.random() * this.abilityOptions.length,
                                )
                                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
                            ],
                        ),
                    ]);
                }
            }
            newPiece?.getBackpack().setAbilities(abilities);

            let perfromingPiece = this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece();
            let startSquare = this.game
                .getGameBoard()
                .getSquare(this.startLocation);
            this.game
                .getGameBoard()
                .getSquare(this.startLocation)
                .getPiece()
                ?.updateAction(ActionType.Summon);
            if (newPiece instanceof PieceJudge) {
                newPiece.increaseTenure(this.game.getTurnNumber());
            }
            let emptySquare = this.game.getGameBoard().findRandomEmptySquare();
            if (newPiece) {
                this.game.getCurrentTeam().addPieceToTeam(newPiece);
            }
            emptySquare.setPiece(newPiece);
            let loop = true;
            while (loop) {
                loop = false;
                if (
                    newPiece instanceof PieceMinion &&
                    perfromingPiece instanceof PieceMinion
                ) {
                    if (
                        startSquare.getSquareColor() ===
                        emptySquare.getSquareColor()
                    ) {
                        emptySquare = this.game
                            .getGameBoard()
                            .findRandomEmptySquare();
                        loop = true;
                    }
                } else if (
                    newPiece instanceof PieceGhost &&
                    perfromingPiece instanceof PieceGhost
                ) {
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
                } else if (
                    newPiece instanceof PieceBlueHen &&
                    perfromingPiece instanceof PieceBlueHen
                ) {
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
            emptySquare.getPiece()?.speak();
            this.game.takeHalfTurn();
        }
        return true;
    }
}
