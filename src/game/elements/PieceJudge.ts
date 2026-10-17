/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionType, BoardLocation } from "./Utilities";
import { Backpack } from "./Backpack";
import { Piece } from "./Piece";
import { ActionMove } from "../actions/ActionMove";

export class PieceJudge extends Piece {
    //The Judge may not be attacked until the number of turns passed is equal to the number in its tenure member variable. One round is two turns, with each team taking one. Tenure does not apply if the Judge is standing on a tower control space.
    //The Judge has a unique injunction ability, which, when used, randomly chooses two abilities and stops the other team from using them for one round. The injunction ability may not be used two rounds in a row by the same team. Using an injunction ability does not cound as a full turn, allowing any secondary action to be taken by any piece of the current team.
    //The Judge may not attack.
    //Impartiality: The Judge may not move to either of the two empty spaces that were most recently occupied by a piece from either team.
    private tenure: number = Math.floor(Math.random() * 10 + 1) * 2;

    constructor(
        symbol: string = "J",
        teamColor: string = "NON",
        backpack: Backpack = new Backpack(),
        active: boolean = true,
    ) {
        super(symbol, teamColor, backpack, active);
        this.permAbilities.push(ActionType.Injunction);
    }

    public validPath(
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ): boolean {
        if (super.validPath(startLocation, endLocation)) {
            return (
                ((endLocation.getRow() === startLocation.getRow() - 1 ||
                    endLocation.getRow() === startLocation.getRow() + 1) &&
                    startLocation.getCol() === endLocation.getCol()) ||
                (Math.abs(startLocation.getRow() - endLocation.getRow()) ===
                    Math.abs(startLocation.getCol() - endLocation.getCol()) &&
                    Math.abs(startLocation.getRow() - endLocation.getRow()) ===
                        1 &&
                    Math.abs(startLocation.getCol() - endLocation.getCol()) ===
                        1) ||
                (startLocation.getRow() === endLocation.getRow() &&
                    (Math.abs(startLocation.getCol() - endLocation.getCol()) ===
                        1 ||
                        Math.abs(
                            startLocation.getCol() - endLocation.getCol(),
                        ) === 1))
            );
        } else {
            return false;
        }
    }

    public spawn(): PieceJudge {
        let newJudge = new PieceJudge(
            "j",
            this.teamColor,
            this.backpack.clone(),
            true,
        );
        this.numSpawns++;
        newJudge.setOriginal(false);
        return newJudge;
    }

    public increaseTenure(increase: number) {
        this.tenure = this.tenure + increase;
    }

    public getTenure(): number {
        return this.tenure;
    }

    public speak(): string {
        return "Order in the court!";
    }

    toStringwithBackPack(): string {
        // change to include backpack abilities
        return (
            super.toString() +
            "\t" +
            this.backpack.toString() +
            ` Tenure: ${this.tenure / 2} rounds`
        );
    }
}
