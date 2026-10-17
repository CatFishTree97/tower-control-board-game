/* Problem 4
Abstractly represents the actions a player can take.

4.1 Create an abstract class named Action with the following:
- member field to represent your game  (type GameS26)
- member field to represent the action type (ActionType)
- constructor with two parameters that sets the member fields
4.2 An abstract method validAction with no parameters and returns a boolean
4.3 An abstract method performAction with no parameters and returns a boolean

- This class will be tested when you created more subclasses.
*/

import { Game } from "../elements/Game";
import { ActionType } from "../elements/Utilities";

export abstract class Action {
    protected game: Game;
    protected type: ActionType;

    constructor(game: Game, type: ActionType) {
        this.game = game;
        this.type = type;
    }

    abstract validAction(): boolean;

    abstract performAction(): boolean;
}
