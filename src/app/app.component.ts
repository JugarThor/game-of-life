import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';

class Cell {
  public status: boolean; // alive or death

  constructor(status: boolean = false) {
    this.status = status;
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
  public panelNextStep: Cell[][] = [];

  subscription: Subscription;

  public steps: number = 0;
  public population: number = 0;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.build();
  }

  build(): void {
    for (let y = 0; y < this.rows; y++) {
      this.panel.push([]);
      for (let x = 0; x < this.cols; x++) {
        const cell = new Cell();
        this.panel[y].push(cell);
      }
    }
    this.panelNextStep = this.deepcopy(this.panel);
  }

  deepcopy(matrix: Cell[][]): any {
    this.population = 0;
    let copy = [];
    for (let y = 0; y < this.rows; y++) {
      copy.push([]);
      for (let x = 0; x < this.cols; x++) {
        const cell = new Cell(matrix[y][x].status);
        copy[y].push(cell);
        if (matrix[y][x].status) {
          this.population++;
        }
      }
    }
    return copy;
  }

  play(): void {
    const source = interval(0);
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
        const cell = this.panelNextStep[y][x];
        this.checkCell(cell, x, y);
      }
    }
    this.panel = this.deepcopy(this.panelNextStep);
    this.clear(this.panelNextStep);
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
        cell.revive();
      } else {
        // death
        cell.kill();
      }
    } else {
      // is death
      if (countAlive == 3) cell.revive();
    }
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
  public gof: GameOfLife = new GameOfLife(10, 10); // Game Of Life

  public errors: boolean = false;
  public stringError: string;
  constructor() {}

  ngOnInit(): void {
    console.log(this.gof);
  }

  changeCellStatus(cell: Cell): void {
    this.clearError();
    if (this.editMode) {
      cell.toggleCell();
      if (cell.status) {
        this.gof.population++;
      } else {
        this.gof.population--;
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

  clearError(): void {
    this.errors = false;
  }

  sendError(error: string): void {
    this.errors = true;
    this.stringError = error;
  }
}
