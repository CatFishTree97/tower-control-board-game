import { Piece } from "../src/game/elements/Piece";
import { PieceBlueHen } from "../src/game/elements/PieceBlueHen";
import { PieceMinion } from "../src/game/elements/PieceMinion";
import { PieceGhost } from "../src/game/elements/PieceGhost";
import { GameBoard } from "../src/game/elements/GameBoard";
import { ActionType } from "../src/game/elements/Utilities";
import { GameS26 } from "../src/game/elements/GameS26";
import { Team } from "../src/game/elements/Team";
import { Ability } from "../src/game/elements/Ability";
import { Backpack } from "../src/game/elements/Backpack";
import { Game } from "../src/game/elements/Game";

export class TestGame {
    public aBackpack: Backpack = new Backpack([new Ability(ActionType.Swap)]);
    public bBackpack: Backpack = new Backpack([new Ability(ActionType.Swap)]);
    public cBackpack: Backpack = new Backpack([]);

    public teamAColor: string = "Red";
    public teamBColor: string = "Blue";
    public aBlueHen: PieceBlueHen = new PieceBlueHen(
        "H",
        this.teamAColor,
        this.aBackpack,
        true,
    );
    public bBlueHen: PieceBlueHen = new PieceBlueHen(
        "H",
        this.teamBColor,
        this.bBackpack,
        true,
    );
    public aMinion: PieceMinion = new PieceMinion(
        "M",
        this.teamAColor,
        new Backpack([
            new Ability(ActionType.Revive),
            new Ability(ActionType.Spawn),
        ]),
        true,
    );
    public bMinion: PieceMinion = new PieceMinion(
        "M",
        this.teamBColor,
        this.cBackpack,
        true,
    );
    public backpackAGhost = new Backpack([new Ability(ActionType.Renew)]);
    public aGhost: PieceGhost = new PieceGhost(
        "G",
        this.teamAColor,
        this.backpackAGhost,
        true,
    );
    public backpack6 = new Backpack([new Ability(ActionType.Revive)]);
    public bGhost: PieceGhost = new PieceGhost(
        "G",
        this.teamBColor,
        this.backpack6,
        true,
    );

    public bDormantGhost1: PieceGhost = new PieceGhost(
        "G",
        this.teamBColor,
        this.bBackpack.clone(),
        true,
    );

    public bDormantGhost2: PieceGhost = new PieceGhost(
        "G",
        this.teamBColor,
        this.aBackpack.clone(),
        true,
    );

    public bAliveGhost1: PieceGhost = new PieceGhost(
        "G",
        this.teamBColor,
        this.bBackpack.clone(),
        true,
    );

    public aPieces: Piece[] = [this.aBlueHen, this.aMinion, this.aGhost];
    public bPieces: Piece[] = [this.bBlueHen, this.bMinion, this.bGhost];

    public teamA: Team = new Team(this.teamAColor, this.aPieces);
    public teamB: Team = new Team(this.teamBColor, this.bPieces);

    public gameBoard: GameBoard = new GameBoard(6, 8);
    public game: Game = new GameS26(
        this.gameBoard,
        this.teamA,
        this.teamB,
        this.teamA,
    );

    constructor() {
        this.loadPieces();
    }

    loadPieces() {
        // remove all pieces
        for (let row of this.gameBoard.getAllSquares()) {
            for (let square of row) {
                // remove piece
                if (!square.isEmpty()) {
                    square.removePiece();
                }
            }
        }
        // load pieces in diagonal
        this.game.getGameBoard().getAllSquares()[0][0].setPiece(this.aBlueHen);
        this.game.getGameBoard().getAllSquares()[1][1].setPiece(this.bBlueHen);
        this.game.getGameBoard().getAllSquares()[2][2].setPiece(this.aMinion);
        this.game.getGameBoard().getAllSquares()[3][3].setPiece(this.bMinion);
        this.game.getGameBoard().getAllSquares()[4][4].setPiece(this.aGhost);
        this.game.getGameBoard().getAllSquares()[5][5].setPiece(this.bGhost);
    }

    loadDormantGhosts() {
        // load a dormant ghost onto team and board
        this.teamB.addPieceToTeam(this.bDormantGhost1);
        this.bDormantGhost1.changeDormant(true);
        this.game
            .getGameBoard()
            .getAllSquares()[0][5]
            .setPiece(this.bDormantGhost1);
        // load a ghost onto team and board
        this.teamB.addPieceToTeam(this.bAliveGhost1);
        this.game
            .getGameBoard()
            .getAllSquares()[1][4]
            .setPiece(this.bAliveGhost1);
        // load another dormant ghost onto team and board
        this.teamB.addPieceToTeam(this.bDormantGhost2);
        this.bDormantGhost2.changeDormant(true);
        this.game
            .getGameBoard()
            .getAllSquares()[2][3]
            .setPiece(this.bDormantGhost2);
    }
}
