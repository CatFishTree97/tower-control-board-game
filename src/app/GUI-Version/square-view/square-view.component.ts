/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BindAttribute,
    BindStyle,
    BindStyleToNumberAppendPx,
    BindVisibleToBoolean,
    Click,
    Notifier,
    WebzComponent,
} from "@boots-edu/webz";
import html from "./square-view.component.html";
import css from "./square-view.component.css";
import { BoardSquare } from "../../../game/elements/BoardSquare";
import { BoardLocation, MinionKind } from "../../../game/elements/Utilities";
import { PieceBlueHen } from "../../../game/elements/PieceBlueHen";
import { PieceMinion } from "../../../game/elements/PieceMinion";
import { PieceGhost } from "../../../game/elements/PieceGhost";
import { PieceJudge } from "../../../game/elements/PieceJudge";
import { Piece } from "../../../game/elements/Piece";

export class SquareViewComponent extends WebzComponent {
    // Part B - Steps 3-5
    @BindStyle("square", "backgroundImage")
    private squareBackgroundImage: string = "";

    private squareColor: string = "black";

    @BindStyle("square", "backgroundSize")
    private backgroundSize: string = "cover";

    @BindStyle("square", "backgroundRepeat")
    private backgroundRepeat: string = "repeat";

    @BindStyleToNumberAppendPx("square", "width")
    @BindStyleToNumberAppendPx("square", "height")
    private squareSize: number = 50;

    @BindVisibleToBoolean("image")
    private hasImage: boolean = false;

    getSquareSize() {
        return this.squareSize;
    }

    // Part B - Step 20
    @BindAttribute("image", "src", (imgName: string): string => {
        return "assets/images/" + imgName;
    })
    public imgName: string = "blue_hen.png";

    // Part B - Step 21
    @BindStyle("image", "background")
    private imageBackgroundColor: string = "green";

    // Part B - Step 22
    @BindStyleToNumberAppendPx("image", "width")
    @BindStyleToNumberAppendPx("image", "height")
    private imageSize: number = 30;

    // Part B - Step 23
    @BindStyleToNumberAppendPx("image", "padding")
    private padding: number = 10;

    // Part B - Step 31
    clickedSquare: Notifier<BoardLocation> = new Notifier<BoardLocation>();

    // fields for the BoardSquare and for where the location of this square is
    private squareData: BoardSquare;
    private location: BoardLocation;
    constructor(squareData: BoardSquare, location: BoardLocation) {
        super(html, css);
        this.squareData = squareData;
        this.location = location;
        this.setImage(this.squareData);
    }

    public redraw(squareData: BoardSquare): void {
        this.squareData = squareData;
        this.setImage(squareData);
    }

    private getCheckerColor(): string {
        if ((this.location.getRow() + this.location.getCol()) % 2 === 0) {
            return "white";
        } else {
            return "black";
        }
    }

    // Part B Step 25
    setImage(squareData: BoardSquare) {
        // Part B Step 27
        let isFlag: boolean = squareData.isTowerControl();
        let checkerColor: string = this.getCheckerColor();
        if (squareData.isEmpty()) {
            this.imgName = "";
            this.hasImage = false;
            this.imageBackgroundColor = "transparent";
            if (isFlag) {
                if (checkerColor === "white") {
                    this.squareBackgroundImage =
                        'url("assets/images/TowerSquareWhite.jpg")';
                } else {
                    this.squareBackgroundImage =
                        'url("assets/images/TowerSquareBlack.jpg")';
                }
            } else {
                if (checkerColor === "white") {
                    this.squareBackgroundImage =
                        'url("assets/images/SquareWhite.png")';
                } else {
                    this.squareBackgroundImage =
                        'url("assets/images/SquareBlack.png")';
                }
            }
        } else {
            this.hasImage = true;
            let piece: Piece | null = squareData.getPiece();
            if (piece) {
                this.imageBackgroundColor = "transparent";
                if (piece.getTeamColor() === "blue") {
                    if (isFlag) {
                        this.squareBackgroundImage =
                            'url("assets/images/TowerSquareBlue.jpg")';
                    } else {
                        this.squareBackgroundImage =
                            'url("assets/images/SquareBlue.png")';
                    }
                } else if (piece.getTeamColor() === "red") {
                    if (isFlag) {
                        this.squareBackgroundImage =
                            'url("assets/images/TowerSquareRed.jpg")';
                    } else {
                        this.squareBackgroundImage =
                            'url("assets/images/SquareRed.png")';
                    }
                }
            }
            if (piece instanceof PieceBlueHen) {
                this.imgName = "bluehen.png";
            } else if (piece instanceof PieceMinion) {
                if ((<PieceMinion>piece).getKind() === MinionKind.Evil) {
                    this.imgName = "evil-minion.png";
                } else {
                    this.imgName = "friendly-minion.png";
                }
            } else if (piece instanceof PieceGhost) {
                if ((<PieceGhost>piece).isDormant()) {
                    this.imgName = "dormant-ghost.png";
                } else {
                    this.imgName = "ghost.png";
                }
            } else if (piece instanceof PieceJudge) {
                this.imgName = "judge.png";
            }
        }
    }

    @Click("square")
    onclick() {
        this.clickedSquare.notify(this.location);
    }
}
