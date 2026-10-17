import { ActionRecruit } from "../src/game/actions/ActionRecruit";
import { BoardLocation } from "../src/game/elements/Utilities";
import { TestGame } from "./TestGame";

describe("Valid Paths", () => {
    let testGame: TestGame = new TestGame();
    console.log("At Start: \n" + testGame.game.getGameBoard().toString());

    test("(2 pts)  Piece Minion Valid Path", () => {
        // minon can only go one space diagonally
        // [2][2]

        let valid: boolean;
        for (let i = 0; i < testGame.gameBoard.getNumRows(); i++) {
            for (let j = 0; j < testGame.gameBoard.getNumColumns(); j++) {
                valid =
                    (i === 1 || i === 3) && (j === 1 || j === 3) ? true : false;
                expect(
                    testGame.aMinion.validPath(
                        new BoardLocation(2, 2),
                        new BoardLocation(i, j),
                    ),
                ).toEqual(valid);
            }
        }
    });

    test("(2 pts)  Piece Ghost Valid Path", () => {
        // ghost can only go on or two spaces left or right
        // [4][4]
        let valid: boolean;
        for (let i = 0; i < testGame.gameBoard.getNumRows(); i++) {
            for (let j = 0; j < testGame.gameBoard.getNumColumns(); j++) {
                if (i === 4) {
                    valid =
                        j === 2 || j === 3 || j === 5 || j === 6 ? true : false;
                } else {
                    valid = false;
                }
                expect(
                    testGame.aGhost.validPath(
                        new BoardLocation(4, 4),
                        new BoardLocation(i, j),
                    ),
                ).toEqual(valid);
            }
        }
    });

    // blue hen on piece 0

    test("(2 pts)  Piece BlueHen Valid Path", () => {
        // blue hen can fly anywhere
        // [0][0]
        let valid: boolean;
        for (let i = 0; i < testGame.gameBoard.getNumRows(); i++) {
            for (let j = 0; j < testGame.gameBoard.getNumColumns(); j++) {
                expect(
                    testGame.aBlueHen.validPath(
                        new BoardLocation(0, 0),
                        new BoardLocation(i, j),
                    ),
                ).toEqual(true);
            }
        }

        // blue hen that can't fly
        testGame.bBlueHen.increaseNumAttacks();
        testGame.bBlueHen.increaseNumAttacks();
        testGame.bBlueHen.increaseNumAttacks();
        testGame.bBlueHen.increaseNumAttacks();
        testGame.bBlueHen.increaseNumAttacks();

        // blue hen can't fly
        // [1][1]
        for (let i = 0; i < testGame.gameBoard.getNumRows(); i++) {
            for (let j = 0; j < testGame.gameBoard.getNumColumns(); j++) {
                valid =
                    (i === 0 && j === 1) || (i === 2 && j === 1) ? true : false;
                //console.log(i, " ", j, " ", valid);
                expect(
                    testGame.bBlueHen.validPath(
                        new BoardLocation(1, 1),
                        new BoardLocation(i, j),
                    ),
                ).toEqual(valid);
            }
        }
    });

    test("(1 pts)  check valid path called from ActionStartEnd", () => {
        // try an invalid recruit - with invalidPath
        let recruitAction = new ActionRecruit(
            testGame.game,
            new BoardLocation(2, 2),
            new BoardLocation(5, 5),
        );
        expect(recruitAction.validAction()).toEqual(false);

        // try a valid
        recruitAction = new ActionRecruit(
            testGame.game,
            new BoardLocation(2, 2),
            new BoardLocation(1, 1),
        );
        expect(recruitAction.validAction()).toEqual(true);
    });
});
