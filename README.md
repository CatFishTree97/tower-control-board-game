# Blue Hen Tower Wars

A turn-based, two-team strategy board game built with **TypeScript** and the **WebZ** framework, with both a text view and a graphical (GUI) view. Each team commands a Blue Hen, a Minion, a Ghost, and a Judge, and fights to control the board's two towers.

Originally developed as the CISC181 final project (game mode: `GameBDB`).

## Table of Contents

- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [How to Play (Instruction Manual)](#how-to-play-instruction-manual)
  - [Overview](#overview)
  - [Objective](#objective)
  - [The Four Pieces](#the-four-pieces)
  - [Permanent Abilities](#permanent-abilities)
  - [Inventory Abilities](#inventory-abilities)
- [Project Structure](#project-structure)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer (includes `npm`)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recommended)

### Setup

1. **Clone** this repository to your local machine:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Open** the folder in VS Code:

   ```bash
   code .
   ```

3. **Install** the dependencies:

   ```bash
   npm install
   ```

4. **Start** the development server:

   ```bash
   npm start
   ```

   Then open the local address printed in the terminal (usually `http://localhost:8080`) in your browser.

5. **Run the tests** to confirm everything works:

   ```bash
   npm test
   ```

## Available Scripts

| Command                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `npm start`            | Start the webpack dev server and play the game      |
| `npm run build`        | Create a development build                          |
| `npm run build:prod`   | Create a production build                           |
| `npm test`             | Run the Jest test suite                             |
| `npm run watch`        | Re-run tests automatically when files change        |
| `npm run coverage`     | Run tests with a coverage report                    |
| `npm run lint`         | Check the code with ESLint                          |
| `npm run lint:fix`     | Automatically fix lint issues                       |
| `npm run format`       | Format the code with Prettier                       |
| `npm run doc`          | Generate API documentation with TypeDoc             |

## How to Play (Instruction Manual)

### Overview

This game takes place on a 5x4 game board. Each team starts with 4 pieces: a Blue Hen, a Minion, a Ghost, and a Judge. On each turn, you can take one action with one piece. There are **permanent abilities**, which include moving and attacking, and **inventory abilities**, which are randomized per piece. Moving and attacking work similarly to chess.

### Objective

The game is "tower control." At the beginning of the game, two towers and each team's 4 pieces are randomly placed across the board. The goal is to have **both tower spaces occupied by your team**.

- For each turn that your team occupies both tower spaces, the score counter moves by 1 in your team's direction (positive for the blue team, negative for the red team).
- If the score reaches **+10**, the blue team wins. If it reaches **-10**, the red team wins.
- For each turn that neither tower is occupied by a piece, the score moves 1 closer to 0.

**Tiebreaker:** If both teams lose the ability to win, the winner is the team that achieved a score closest to winning. If both teams were equally close to winning, the game ends when one team no longer has any pieces left on the board.

### The Four Pieces

#### Blue Hen

- Has two states: **flight-capable** and **flightless**.
  - When flight-capable, it can move anywhere on the board.
  - When flightless, it can only move up and down.
- The Blue Hen becomes flightless after attacking twice. It cannot regain its flight abilities.

#### Minion

- Moves one space diagonally in any direction.
- Special permanent ability: **Recruit**. It compels any piece within its attack range to switch teams.
- A Minion can only use Recruit up to 3 times, after which it turns purple and loses all of its inventory abilities.

#### Ghost

- Moves 1 to 2 spaces left or right.
- Unlike other pieces, the Ghost remains on the board after being attacked. However, it enters a **dormant** state and cannot move or take any actions.
- While dormant, the Ghost may be brought back using a **Revive** action. If attacked while dormant, the Ghost dies permanently.

#### Judge

- Moves one space in any direction.
- Special ability: **Injunction**. It picks two random abilities and suspends the other team's capacity to use them for one round. Injunction has a cooldown of one round before it can be used again; this applies to the entire team.
- Special properties:
  - **Tenure:** A random number decided when the Judge is spawned or summoned. The Judge is immune to attacks until the round of that number has passed. This immunity does not apply to Recruit.
  - **Impartiality:** The Judge may not move to either of the two most recently occupied spaces.
  - The Judge **cannot attack**.

### Permanent Abilities

These do not expire after being used. Each ability consumes a turn unless otherwise noted.

| Ability       | Description                                                                          |
| ------------- | ------------------------------------------------------------------------------------ |
| **Move**      | Move the piece according to its movement rules.                                      |
| **Attack**    | A piece can only attack other pieces within its movement range.                      |
| **Recruit**   | Exclusive to the Minion.                                                             |
| **Injunction**| Exclusive to the Judge. Only consumes half a turn.                                   |

### Inventory Abilities

Each piece is randomly given 0-3 abilities at the start of the game or when summoned. Inventory abilities can only be used once unless they are renewed. Each ability consumes one turn unless otherwise noted.

| Ability     | Description                                                                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Renew**   | Renews the inventory abilities of any team member. The target must be within the user piece's movement range.                                                                |
| **Revive**  | Revives all dormant Ghosts on the team that uses it. A Ghost must be on the board to be revivable. Ghosts are moved to random new spaces after being revived.               |
| **Spawn**   | Clones the piece that uses it; the new piece is placed on a random space.                                                                                                    |
| **Swap**    | Swaps inventories with an enemy piece of your choice. The target must be within the user piece's movement range.                                                             |
| **Shuffle** | Moves the towers to two random empty spaces.                                                                                                                                 |
| **Guard**   | Makes the piece that uses it immune to attacks for one round. Does not include immunity to Recruit.                                                                          |
| **Summon**  | Creates a random new piece with a new inventory and places it on a random board space for the team that uses it. Only consumes half a turn. Only given to a team that has been losing for multiple rounds in a row. |
| **Pass**    | Forfeits the current turn.                                                                                                                                                   |

## Project Structure

```text
src/
├── app/                 # UI: text view and GUI view components
│   ├── text-view/
│   └── GUI-Version/     # board, square, piece, team, and action views
└── game/
    ├── Controller.ts    # Connects the UI to the game logic
    ├── actions/         # One class per action (Move, Attack, Recruit, ...)
    └── elements/        # Game, board, teams, pieces, abilities
assets/images/           # Piece and board-square artwork
test/                    # Jest tests
```
