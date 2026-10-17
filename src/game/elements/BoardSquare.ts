/* eslint-disable @typescript-eslint/no-unused-vars */
/*Problem 8: 

8.1 Create a class named named BoardSquare which will represent a square
on our game board with the following members:

- member field of type Piece to represent the Piece that is located 
    in this square - this field can either hold a Piece or be null
- member field of type string to represent color of the board square

- constructor with one parameter - color
     - sets the color
     – the square should not have a Piece by default 

8.2 Accessor methods:
    - getPiece, isEmpty, getSquareColor

8.3 Mutator method:
    – setPiece that has a Piece parameter - this method sets the 
       Piece member field       

8.4 Mutator method:
    – removePiece which has no parameters and returns the 
    Piece that is on this square
    -  update the Piece to null 
       (Note: Think about how you can return the Piece while also 
       setting the piece property to null)
 8.5 A toString method with no parameters and returns a string
    - if no Piece on this square should return:  "-------" (7 dashes)
    - if there is a Piece on this square should return: "-"  
      followed by the Piece’s toString() followed by "-" 
*/

import { Piece } from "./Piece";
export class BoardSquare {
    private piece: Piece | null;
    private color: string;
    private towerControl: boolean = false;

    constructor(color: string) {
        this.color = color;
        this.piece = null;
    }

    public isTowerControl(): boolean {
        return this.towerControl;
    }

    public setTowerControl(towerControl: boolean): void {
        this.towerControl = towerControl;
    }

    public getPiece(): Piece | null {
        return this.piece;
    }

    public isEmpty(): boolean {
        if (!this.piece) {
            return true;
        } else {
            return false;
        }
    }

    public getSquareColor(): string {
        return this.color;
    }

    public setPiece(piece: Piece | null): void {
        this.piece = piece;
    }

    public removePiece(): Piece | null {
        if (this.piece) {
            let newPiece: Piece = this.piece;
            this.piece = null;
            return newPiece;
        } else {
            return null;
        }
    }

    public toString(): string {
        if (!this.piece) {
            return "-------";
        } else {
            return "-" + this.piece.toString() + "-";
        }
    }
}
