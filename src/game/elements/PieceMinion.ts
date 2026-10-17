/* eslint-disable @typescript-eslint/no-unused-vars */
/* Problem 5
5.1 Create a subclass of Piece named PieceMinion that will represent a 
minion character from the Despicable Me movie. The Minion Piece will turn
into an evil minion once it has recruited the MAX_RECRUITS from the other team.
This class will inherit members from Piece and additionally include:

- member field to represent the kind of minion it is - use an enumerated type
MinionType from Utilities. The minion will either be friendly (yellow) minion
    or evil (purple) minion - default value friendly
- member field to represent the number of recruits its made - default set to 0

Only the kind field should be added to the constructor parameters.

5.2 A private constant member named MAX_RECRUITS to represent
the number of recruits this minion can make before it turns into 
an evil minion. (When it turns into an evil minion - it attacks instead of recruits)
Set this value to 3

5.3 A constructor with the parameters required by the superclass and the kind field 
     - calls the super class' constructor (symbol should be set to 'M' by default)
     - adds the ActionType - Recruit to its permanent abilities
     - kind is set the kind MinionType.Friendly

5.3 Accessor method:
    - getNumRecruits, getKind

5.4 A mutator:
    – increaseNumRecruits - increments number of recruits by 1 
   
5.5 A PRIVATE method named updateKind that has no
parameters and no return values. This is the only
method that can modify (mutate) the member field 'kind'.
It is private and should be called everytime the
number of recruits is increased. This method will
check the number of current recruits and if it REACHES
the MAX_RECRUITS:
    - it will change the kind to EVIL
    - its symbol will change to 'E'
    - it can only permanently move and attack now
NOTE: After you create this method - call it from 
inside of increaseRecruits.
     
    
5.6 An implementation for the method named speak that has no parameters
and returns the string 'Bello!' if they are a friendly minion and 'Grrr!'
if they are evil.

5.7 An implementation for method named spawn which will return a copy
of the Minion piece (type PieceMinion) with the following properties:
- symbol - should be the SAME as value of spawning object's symbol
- teamColor - should match values of spawning object
- backpack - should be a clone of the spawning object's backpack
- original - should be set to false
- active - should be set to true
- kind - should match the spawning object's kind
- numRecruits - should be set to the spawning object's numRecruits
- numSpawns - should be set to 0
The object doing the spawning should have its number of spawns increased by 1

Note: some of these fields can be set using default values - others cannot

5.8 An override for the updateAction method that:
calls increaseNumRecruits if the ActionType is Recruit,
does nothing if the ActionType is Attack and 
and calls the super's updateAction otherwise

Test your PieceMinion with PieceMinion.test.ts
*/

import { Backpack } from "./Backpack";
import { Piece } from "./Piece";
import { ActionType, MinionKind, BoardLocation } from "./Utilities";
import { Team } from "./Team";

export class PieceMinion extends Piece {
    private kind: MinionKind;
    private members: number = 0;

    constructor(
        symbol: string = "M",
        teamColor: string = "NON",
        backpack: Backpack = new Backpack(),
        active: boolean = true,
        kind: MinionKind = MinionKind.Friendly,
    ) {
        super(symbol, teamColor, backpack, active);
        this.kind = kind;
        if (this.kind === MinionKind.Evil) {
            this.symbol = "E";
        }
        this.permAbilities = [
            ActionType.Move,
            ActionType.Attack,
            ActionType.Pass,
        ];
    }

    private MAX_RECRUITS: number = 3;

    public validPath(
        startLocation: BoardLocation,
        endLocation: BoardLocation,
    ): boolean {
        if (super.validPath(startLocation, endLocation)) {
            return (
                Math.abs(startLocation.getRow() - endLocation.getRow()) ===
                    Math.abs(startLocation.getCol() - endLocation.getCol()) &&
                Math.abs(startLocation.getRow() - endLocation.getRow()) === 1 &&
                Math.abs(startLocation.getCol() - endLocation.getCol()) === 1
            );
        } else {
            return false;
        }
    }

    public getNumRecruits(): number {
        return this.members;
    }

    public getKind(): MinionKind {
        return this.kind;
    }

    public increaseNumRecruits(): void {
        if (this.kind != MinionKind.Evil) {
            this.members++;
            this.updateKind();
        }
    }

    private updateKind(): void {
        if (this.members >= this.MAX_RECRUITS) {
            this.kind = MinionKind.Evil;
            this.symbol = "E";
            this.getBackpack().setAbilities([]);
            this.permAbilities = [
                ActionType.Move,
                ActionType.Attack,
                ActionType.Pass,
            ];
        }
    }

    public speak(): string {
        if (this.kind == MinionKind.Evil) {
            return "Grrr!";
        } else {
            return "Bello!";
        }
    }

    public spawn(): PieceMinion {
        let newMinion = new PieceMinion(
            this.symbol,
            this.teamColor,
            this.getBackpack().clone(),
            true,
        );
        newMinion.setOriginal(false);
        for (let i: number = 1; i <= this.getNumRecruits(); i++) {
            newMinion.increaseNumRecruits();
        }
        this.numSpawns++;
        return newMinion;
    }

    public hasPieceAdditionAbilities(team: Team): boolean {
        return (
            super.hasPieceAdditionAbilities(team) ||
            this.kind === MinionKind.Friendly
        );
    }

    public updateAction(action: ActionType) {
        if (action === ActionType.Recruit) {
            if (this.kind != MinionKind.Evil) {
                this.increaseNumRecruits();
            }
        } else if (action === ActionType.Attack) {
            ("");
        } else {
            super.updateAction(action);
        }
    }

    public allowableAction(action: ActionType): boolean {
        if (action == ActionType.Recruit) {
            if (this.kind === MinionKind.Friendly) {
                return true;
            } else {
                return false;
            }
        } else if (this.kind === MinionKind.Evil) {
            if (action === ActionType.Move || action === ActionType.Attack) {
                return true;
            } else {
                return false;
            }
        } else {
            return super.allowableAction(action);
        }
    }
}
