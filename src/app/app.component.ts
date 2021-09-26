import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';

class Cell {
  public status: boolean; // alive or death
  public nextStatus: boolean;

  constructor(status: boolean = false) {
    this.status = status;
    this.nextStatus = status;
  }

  nextStep(): void {
    this.status = this.nextStatus;
    this.nextStatus = false;
  }

  reviveInNextStep(): void {
    this.nextStatus = true;
  }

  deadInNextStep(): void {
    this.nextStatus = false;
  }

  revive(): void {
    this.status = true;
  }

  kill(): void {
    this.status = false;
  }

  toggleCell(): void {
    if (this.status) {
      this.kill();
    } else {
      this.revive();
    }
  }
}

class GameOfLife {
  public cols: number; // x
  public rows: number; // y
  public panel: Cell[][] = [];

  public interval: number;
  subscription: Subscription;

  public steps: number = 0;
  public population: number = 0;

  /**
   *
   * @param cols number of cols
   * @param rows number of rows
   * @param interval in ms. Example: 1000 -> one step each 1 second.
   */
  constructor(cols: number, rows: number, interval: number = 100) {
    this.cols = cols;
    this.rows = rows;
    this.interval = interval;
    this.build();
  }

  setInterval(time: number): void {
    this.stop();
    this.interval = time;
    this.play();
  }

  build(): void {
    for (let y = 0; y < this.rows; y++) {
      this.panel.push([]);
      for (let x = 0; x < this.cols; x++) {
        const cell = new Cell();
        this.panel[y].push(cell);
      }
    }
  }

  play(): void {
    const source = interval(this.interval);
    this.subscription = source.subscribe(() => {
      this.oneIteration();
    });
  }

  stop(): void {
    this.subscription.unsubscribe();
  }

  clear(panel: Cell[][], full: boolean = false): void {
    for (let y = 0; y < this.rows; y++) {
      const aliveCells = panel[y].filter((cell) => cell.status);
      aliveCells.map((cell) => cell.kill());
    }
    if (full) {
      this.population = 0;
      this.steps = 0;
    }
  }

  oneIteration(): void {
    this.steps++;
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cell = this.panel[y][x];
        this.checkCell(cell, x, y);
      }
    }
    this.changeCellStatus();
  }

  changeCellStatus(): void {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.panel[y][x].nextStep();
      }
    }
  }

  checkCell(cell: Cell, x: number, y: number): void {
    let xprima: number;
    let yprima: number;
    let countAlive: number = 0;

    // check suroundig cells as if the panel was a toroid
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0) {
          // nothing
        } else {
          if (j < 0) {
            xprima = x + j < 0 ? this.cols - 1 : x + j;
          } else {
            xprima = x + j > this.cols - 1 ? 0 : x + j;
          }

          if (i < 0) {
            yprima = y + i < 0 ? this.rows - 1 : y + i;
          } else {
            yprima = y + i > this.rows - 1 ? 0 : y + i;
          }

          if (this.panel[yprima][xprima].status) {
            // si está viva
            countAlive++;
          }
        }
      }
    }

    if (this.panel[y][x].status) {
      // is alive
      if (countAlive === 2 || countAlive === 3) {
        // stay alive
        cell.reviveInNextStep();
      } else {
        // death
        cell.deadInNextStep();
      }
    } else {
      // is death
      if (countAlive == 3) cell.reviveInNextStep();
    }
  }

  printDraw(draw: Draw, x: number, y: number): void {
    const rows: number = draw.drowPanel.length;
    const cols: number = draw.drowPanel[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let xprima = x + j;
        let yprima = y + i;
        yprima = yprima > this.rows - 1 ? 0 : yprima;
        xprima = xprima > this.cols - 1 ? 0 : xprima;
        this.panel[yprima][xprima].status = draw.drowPanel[i][j].status;
      }
    }
  }
}

// model draw object
interface DrawObject {
  grid: number[][];
}

// MODEL DRAW
class Draw {
  public name: string;
  public draw: DrawObject;
  public drowPanel: Cell[][];
  constructor(name: string, draw: DrawObject) {
    this.name = name;
    this.draw = draw;
    this.build();
  }

  build(): void {
    this.drowPanel = this.draw.grid.map((row) => {
      return row.map((cellStatus: number) => {
        return new Cell(!!cellStatus);
      });
    });
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public playMode: boolean = false;
  public editMode: boolean = true;
  public gof: GameOfLife = new GameOfLife(50, 50, 200); // Game Of Life

  public intervalVelocity: number = 200;

  public errors: boolean = false;
  public stringError: string;

  public spaceShipRight: DrawObject = {
    grid: [
      [1, 0, 0, 1, 0],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 1],
    ],
  };
  public spaceShipLeft: DrawObject = {
    grid: [
      [0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ],
  };
  public spaceShipUp: DrawObject = {
    grid: [
      [0, 1, 1, 1],
      [1, 0, 0, 1],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [1, 0, 1, 0],
    ],
  };
  public spaceShipDown: DrawObject = {
    grid: [
      [1, 0, 1, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [1, 0, 0, 1],
      [0, 1, 1, 1],
    ],
  };
  public miniShipDiagonalRight: DrawObject = {
    grid: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  };
  public availableDraws: Draw[] = [
    new Draw('SpaceShip-right', this.spaceShipRight),
    new Draw('SpaceShip-left', this.spaceShipLeft),
    new Draw('SpaceShip-up', this.spaceShipUp),
    new Draw('SpaceShip-down', this.spaceShipDown),

    new Draw('MinishipDiagonal-right', this.miniShipDiagonalRight),
  ];
  public selectedDraw: Draw;

  constructor() {}

  ngOnInit(): void {}

  changeCellStatus(cell: Cell, x: number, y: number): void {
    this.clearError();
    if (this.editMode) {
      if (this.selectedDraw) {
        this.gof.printDraw(this.selectedDraw, x, y);
      } else {
        cell.toggleCell();
        if (cell.status) {
          this.gof.population++;
        } else {
          this.gof.population--;
        }
      }
    } else {
      this.sendError(
        'You need to activate the edit mode to perform this action.'
      );
    }
  }

  edit(): void {
    this.clearError();
    if (!this.playMode) {
      this.editMode = !this.editMode;
    } else {
      this.sendError(
        `Can't activate edit mode while playing. First stop the game.`
      );
    }
  }

  play(): void {
    this.clearError();
    if (this.editMode) {
      this.sendError(`Can't paly in edit mode.`);
    }
    if (this.playMode) {
      this.sendError(`Can't paly again. First stop the game.`);
    }
    if (!this.editMode && !this.playMode) {
      this.gof.play();
      this.playMode = true;
    }
  }

  stop(): void {
    this.clearError();
    this.playMode = false;
    this.gof.stop();
  }

  setVelocity(event: any): void {
    this.gof.setInterval(event);
  }

  selectDraw(draw: Draw) {
    if (this.selectedDraw === draw) {
      this.selectedDraw = null;
    } else {
      this.selectedDraw = draw;
    }
  }

  clearError(): void {
    this.errors = false;
  }

  sendError(error: string): void {
    this.errors = true;
    this.stringError = error;
  }
}
