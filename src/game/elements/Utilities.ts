/**
 * Description: BoardLocation represents a location
 * on the game board at the row index and column index
 * specified by member fields row and col respectively.
 *
 * @export
 * @class BoardLocation
 * @typedef {BoardLocation}
 */

export const enum ActionType {
    Attack = "Attack",
    Move = "Move",
    Recruit = "Recruit",
    Renew = "Renew",
    Revive = "Revive",
    Spawn = "Spawn",
    Swap = "Swap",
    Cancel = "Cancel",
    Injunction = "Injunction",
    Pass = "Pass",
    Guard = "Guard",
    ShuffleTowerControlSpaces = "Shuffle Tower Control Spaces",
    Summon = "Summon",
}

export const enum MinionKind {
    Friendly = "Friendly",
    Evil = "Evil",
}

export class BoardLocation {
    constructor(
        private row: number,
        private col: number,
    ) {}

    public getRow(): number {
        return this.row;
    }

    public getCol(): number {
        return this.col;
    }

    setRow(row: number): void {
        this.row = row;
    }

    setCol(col: number): void {
        this.col = col;
    }
}
