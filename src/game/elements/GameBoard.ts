/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/*Problem 9: 

9.1 Create a class named GameBoard that will represent 
the game board.
Its rows start start at top of the board with row 0
Its columns start at left side of the board with column 0
It will contain a 2D array of BoardSquare objects. 

This class has the following members:

- member field to represent number of rows on the board
- member field to represent number of columns on the board
   (rows start at top of board with row 0 - 
    columns start at left side of board with column 0)
- member field to represent all the spaces on the board – 
    this should be a 2 dimensional array of BoardSquare objects
- constructor with two parameters in this order:
    - number of rows
    - number of columns 
    - this constructor should set these member fields
     and set the 2D array member field to an empty array 

9.2 Accessors methods:
    - getNumRows, getNumColumns, getAllSquares

9.3 Accessor method: 
    - getSquare that has one parameter of type BoardLocation and returns
    the BoardSquare at that location's row and column

9.4 A method named inBounds has one parameter of type BoardLocation
    representing the location of a square on the game board 
    and returns a boolean value representing whether 
    the location of this space is within the bounds of the board 
    (For example:  inBounds( new BoardLocation (3,5)) should return false 
    for any board with less 4 rows or less than 6 columns)

9.5 A private method named setUpEmptyBoard with no parameters and no return value
    - This method creates a BoardSquare object for each location 
    in the 2 dimensional array of BoardSquares.  
    Use nested loops! You should alternate colors between black and white.
    You should start the color of the boardsquare at
    row 0 and col 0 to black and then row 0 col 1 to white.
    NOTE: after completing this method - add a statement to your 
    constructor to call this setUpEmptyBoard method
    After you have done this - see the bottom of the file for code
    that will create a GameBoard and display the colors so you can
    debug.
    HINT: All even rows will start with black and 
    all odd rows will start with white

9.6 A method named isBoardFull that has no parameters and returns a boolean
    representing whether there are no empty squares on the board
    NOTE: This is SIMILAR logic to the Week 2 - In Class Activity function boardFull

9.7 A method named findRandomEmptySquare with no parameters and 
   returns a BoardSquare. This method should call 
   getRandomInt() method (already written for you)
   to generate random row and column indexes
   if this location on the Board is empty – it should return this BoardSquare,
   if not, it should repeat the process until it finds an empty space. 
   NOTE: This is SIMILAR logic to the Week 2 - In Class Activity function
   placeOnEmptySpot 

9.8 A method toString is already defined for you

Test your GameBoard classes with GameBoard.test.ts

*/

import { BoardSquare } from "./BoardSquare";
import { BoardLocation } from "./Utilities";

export class GameBoard {
    /**
     * This function is already defined for you
     * @param min - minimum integer
     * @param max - maximum integer
     * @returns - a random integer between min (inclusive) and max (inclusive)
     */
    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public length: number;
    public width: number;
    spaces: BoardSquare[][] = [[]];

    constructor(length: number, width: number) {
        this.length = length;
        this.width = width;
        this.setUpEmptyBoard();
    }

    public getNumRows(): number {
        return this.length;
    }

    public getNumColumns(): number {
        return this.width;
    }

    public getAllSquares(): BoardSquare[][] {
        return this.spaces;
    }

    public getNumberOfEmptySquares(): number {
        let empty: number = 0;
        for (let row of this.spaces) {
            for (let space of row) {
                if (space.isEmpty()) {
                    empty++;
                }
            }
        }
        return empty;
    }

    public getSquare(location: BoardLocation): BoardSquare {
        return this.spaces[location.getRow()][location.getCol()];
    }

    public inBounds(location: BoardLocation): boolean {
        return (
            location.getRow() < this.length &&
            location.getCol() < this.width &&
            location.getRow() >= 0 &&
            location.getCol() >= 0
        );
    }

    private setUpEmptyBoard(): void {
        for (let i: number = 0; i < this.length; i++) {
            if (i) {
                this.spaces.push([]);
            }
            for (let j: number = 0; j < this.width; j++) {
                let isBlack: boolean =
                    (i % 2 === 0 && j % 2 === 0) ||
                    (i % 2 === 1 && j % 2 === 1);
                if (isBlack) {
                    this.spaces[i][j] = new BoardSquare("black");
                } else {
                    this.spaces[i][j] = new BoardSquare("white");
                }
            }
        }
    }

    public isBoardFull(): boolean {
        for (let row of this.spaces) {
            for (let space of row) {
                if (space.isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    }

    public findRandomEmptySquare(): BoardSquare {
        while (true) {
            let randomRow = GameBoard.getRandomInt(0, this.length - 1);
            let randomColumn = GameBoard.getRandomInt(0, this.width - 1);
            if (this.spaces[randomRow][randomColumn].isEmpty()) {
                return this.spaces[randomRow][randomColumn];
            }
        }
    }

    public sameRow(squareA: BoardSquare, squareB: BoardSquare): boolean {
        let row_a: number = 0;
        let row_b: number = 0;
        for (let row: number = 0; row < this.length; row++) {
            for (let col: number = 0; col < this.width; col++) {
                if (this.getAllSquares()[row][col] === squareA) {
                    row_a = row;
                }
                if (this.getAllSquares()[row][col] === squareB) {
                    row_b = row;
                }
            }
        }
        return row_a === row_b;
    }

    public sameColumn(squareA: BoardSquare, squareB: BoardSquare): boolean {
        let col_a: number = 0;
        let col_b: number = 0;
        for (let row: number = 0; row < this.length; row++) {
            for (let col: number = 0; col < this.width; col++) {
                if (this.getAllSquares()[row][col] === squareA) {
                    col_a = col;
                }
                if (this.getAllSquares()[row][col] === squareB) {
                    col_b = col;
                }
            }
        }
        return col_a === col_b;
    }

    //

    /**
     * This function is already defined for you
     * @returns - a string representation of the game board
     */
    toString(): string {
        let boardString: string = "";
        boardString = boardString.concat("Col :" + "       ");

        for (let col = 0; col < this.getNumRows(); col++) {
            boardString = boardString.concat(col + "        ");
        }
        boardString = boardString.concat("\n");
        for (let row = 0; row < this.getNumRows(); row++) {
            boardString = boardString.concat("Row : " + row + "   ");
            for (let col = 0; col < this.getNumColumns(); col++) {
                boardString = boardString.concat(
                    this.getAllSquares()[row][col].toString() + "  ",
                );
            }
            boardString = boardString.concat("\n");
        }
        return boardString;
    }
}

/* After you have completed setUpEmptyBoard, you can run this
code with this command in the terminal to see if your colors
are getting assigned correctly:
 npx ts-node GameBoard.ts
 */

export function squareColors(board: GameBoard): string {
    let boardString: string = "";
    boardString = boardString.concat("Col :   ");

    for (let col = 0; col < board.getNumColumns(); col++) {
        boardString = boardString.concat(col + "   ");
    }
    boardString = boardString.concat("\n");
    for (let row = 0; row < board.getNumRows(); row++) {
        boardString = boardString.concat("Row : " + row + "   ");
        for (let col = 0; col < board.getNumColumns(); col++) {
            boardString = boardString.concat(
                board.getAllSquares()[row][col].getSquareColor() + "  ",
            );
        }
        boardString = boardString.concat("\n");
    }
    return boardString;
}

let boardEvenCols: GameBoard = new GameBoard(3, 6);
console.log(squareColors(boardEvenCols));

let boardOddCols: GameBoard = new GameBoard(5, 7);
console.log(squareColors(boardOddCols));
