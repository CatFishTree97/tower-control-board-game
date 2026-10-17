/* eslint-disable @typescript-eslint/no-unused-vars */
import { Click, Notifier, WebzComponent } from "@boots-edu/webz";
import html from "./action-view.component.html";
import css from "./action-view.component.css";
import { ActionType } from "../../../game/elements/Utilities";
import { Action } from "../../../game/actions/Action";

export class ActionViewComponent extends WebzComponent {
    // Notifier for Cancel button
    cancelNotifier: Notifier = new Notifier();

    // Notifier for all other Actions
    moveNotifier: Notifier<ActionType> = new Notifier<ActionType>();
    attackNotifier: Notifier<ActionType> = new Notifier<ActionType>();
    recruitNotifier: Notifier<ActionType> = new Notifier<ActionType>();
    spawnNotifier: Notifier<ActionType> = new Notifier<ActionType>();
    swapNotifier: Notifier<ActionType> = new Notifier<ActionType>();
    renewNotifier: Notifier<ActionType> = new Notifier<ActionType>();
    reviveNotifier: Notifier<ActionType> = new Notifier<ActionType>();
    stealNotifier: Notifier<ActionType> = new Notifier<ActionType>();
    guardNotifier: Notifier<ActionType> = new Notifier<ActionType>();
    passNotifier: Notifier<ActionType> = new Notifier<ActionType>();
    injunctionNotifier: Notifier<ActionType> = new Notifier<ActionType>();
    shuffleTowerControlSpacesNotifier: Notifier<ActionType> =
        new Notifier<ActionType>();

    // Notifier array
    private actionNotifiers: Notifier<ActionType>[] = [
        this.moveNotifier,
        this.attackNotifier,
        this.recruitNotifier,
        this.spawnNotifier,
        this.swapNotifier,
        this.renewNotifier,
        this.reviveNotifier,
        this.guardNotifier,
        this.passNotifier,
        this.injunctionNotifier,
        this.shuffleTowerControlSpacesNotifier,
    ];

    constructor() {
        super(html, css);
    }

    getNotifiers(): Notifier<ActionType>[] {
        return this.actionNotifiers;
    }

    @Click("injunction")
    onInjunction() {
        this.injunctionNotifier.notify(ActionType.Injunction);
    }

    @Click("guard")
    onGuard() {
        this.guardNotifier.notify(ActionType.Guard);
    }

    @Click("pass")
    onPass() {
        this.passNotifier.notify(ActionType.Pass);
    }

    @Click("shuffletowercontrolspaces")
    onShuffleTowerControlSpaces() {
        this.shuffleTowerControlSpacesNotifier.notify(
            ActionType.ShuffleTowerControlSpaces,
        );
    }

    @Click("cancel")
    onCancel() {
        this.cancelNotifier.notify();
    }

    @Click("move")
    onMove() {
        this.moveNotifier.notify(ActionType.Move);
    }

    @Click("attack")
    onAttack() {
        this.attackNotifier.notify(ActionType.Attack);
    }

    @Click("recruit")
    onRecruit() {
        this.recruitNotifier.notify(ActionType.Recruit);
    }

    @Click("spawn")
    onSpawn() {
        this.spawnNotifier.notify(ActionType.Spawn);
    }
    @Click("swap")
    onSwap() {
        this.swapNotifier.notify(ActionType.Swap);
    }

    @Click("renew")
    onRenew() {
        this.renewNotifier.notify(ActionType.Renew);
    }

    @Click("revive")
    onRevive() {
        this.reviveNotifier.notify(ActionType.Revive);
    }

    @Click("summon")
    onSummon() {
        this.reviveNotifier.notify(ActionType.Summon);
    }
}
