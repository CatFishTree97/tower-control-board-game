/* eslint-disable @typescript-eslint/no-unused-vars */
/*Problem 7

7.1 Create a new class named Team that will represent one
player's set of game pieces. It will contain the following members:

- member field of type string for the color of the team
- member field to represent all Pieces that the belongs to the team 
    this should be of an array of Pieces (since they will have more than
    one type of Piece)

7.2 A constructor with two parameters: 
    (parameters should be in the order listed above) that sets the two member fields

7.3 Two accessor methods:
    – getTeamColor and getAllPieces

7.4 A mutator method named removePieceFromTeam with a Piece
parameter and no return value. This method removes the Piece from the array.

7.5 A mutator method named addPieceToTeam with one parameter Piece and no return value.
    This method should add the Piece to the Team AND set the Piece’s 
    color to the team color.

7.6 An accessor method named filterPieces that has one boolean parameter 
representing whether the filtered array should contain active (true) or
inactive (false) Pieces. This method should not modify this team's
array. It should return a new array of pieces.

7.7 toString method is provided for you - uncomment when ready
*/

import { Piece } from "./Piece";
import { ActionType } from "./Utilities";
import { PieceGhost } from "./PieceGhost";
import { ActionRenew } from "../actions/ActionRenew";

export class Team {
    private color: string;
    private pieces: Piece[] = [];
    private cannotInjunctionAgainUntil: number = 0;
    private guarding: boolean = false;

    constructor(color: string, pieces: Piece[]) {
        this.color = color;
        this.pieces = pieces;
    }

    public guard(): void {
        this.guarding = true;
    }

    public unguard(): void {
        this.guarding = false;
    }

    public isGuarding(): boolean {
        return this.guarding;
    }

    public getTeamColor(): string {
        return this.color;
    }

    public getCannotInjunctionAgainUntil(): number {
        return this.cannotInjunctionAgainUntil;
    }

    public logInjunction(cooldown: number): void {
        this.cannotInjunctionAgainUntil =
            this.cannotInjunctionAgainUntil + cooldown;
    }

    public getAllPieces(): Piece[] {
        return this.pieces;
    }

    public removePieceFromTeam(piece: Piece) {
        let i: number = 0;
        for (let piece_ of this.pieces) {
            if (piece_ === piece) {
                this.pieces.splice(i, 1);
                break;
            }
            i++;
        }
    }

    public addPieceToTeam(piece: Piece) {
        piece.setTeamColor(this.color);
        this.pieces.push(piece);
    }

    public filterPieces(active: boolean): Piece[] {
        let pieces = [];
        for (let piece of this.pieces) {
            if (piece.isActive() === active) {
                pieces.push(piece);
            }
        }
        return pieces;
    }

    public findPieceWithAbility(actionType: ActionType): Piece | null {
        for (let piece of this.pieces) {
            if (piece.getBackpack().hasAbility(actionType)) {
                return piece;
            }
        }
        return null;
    }

    public hasActiveOrRevivableGhosts(): boolean {
        for (let piece of this.pieces) {
            if (piece instanceof PieceGhost) {
                if (piece.getOnBoard()) {
                    return true;
                }
            }
        }
        return false;
    }

    public hasPieceAdditionAbilities(): boolean {
        for (let piece of this.filterPieces(true)) {
            if (piece.hasPieceAdditionAbilities(this)) {
                return true;
            }
        }
        let hasExpiredPieceAdditionAbilities = false;
        for (let piece of this.filterPieces(true)) {
            if (piece.hasExpiredPieceAdditionAbilities(this)) {
                hasExpiredPieceAdditionAbilities = true;
            }
        }
        if (hasExpiredPieceAdditionAbilities) {
            for (let piece of this.filterPieces(true)) {
                if (piece.getBackpack().hasUsableAbility(ActionType.Renew)) {
                    return true;
                }
            }
        }
        return false;
    }

    toString(): string {
        let retString: string =
            "Team : " + this.getTeamColor() + "\n\n  Active Pieces : \n";
        for (let eachPiece of this.filterPieces(true)) {
            retString += "\n  " + eachPiece.toStringwithBackPack();
        }
        retString += "\n\n  Inactive Pieces : \n";
        for (let eachPiece of this.filterPieces(false)) {
            retString += "\n  " + eachPiece.toStringwithBackPack();
        }
        return retString;
    }
}
