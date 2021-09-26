import { Cell } from '@models/cell.model';
import { Drawing } from '@models/drawing.model';
import { interval, Subscription } from 'rxjs';

export class GameOfLife {
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

  /**
   * Set the velocity of each iteration
   * @param time
   */
  setInterval(time: number): void {
    this.stop();
    this.interval = time;
    this.play();
  }

  /**
   * Builds the grid
   */
  build(): void {
    for (let y = 0; y < this.rows; y++) {
      this.panel.push([]);
      for (let x = 0; x < this.cols; x++) {
        const cell = new Cell();
        this.panel[y].push(cell);
      }
    }
  }

  /**
   * Starts the game
   */
  play(): void {
    const source = interval(this.interval);
    this.subscription = source.subscribe(() => {
      this.oneIteration();
    });
  }

  /**
   * Stop the game
   */
  stop(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Clear all cells
   */
  clear(): void {
    for (let y = 0; y < this.rows; y++) {
      const aliveCells = this.panel[y].filter((cell) => cell.status);
      aliveCells.map((cell) => cell.kill());
    }
    this.population = 0;
    this.steps = 0;
  }

  /**
   * Only performs one stpe
   */
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

  /**
   * Change the cell to next status
   */
  changeCellStatus(): void {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cellProcess = this.panel[y][x].nextStep();

        if (cellProcess.changed) {
          this.population += cellProcess.currentStatus ? 1 : -1;
        }
      }
    }
  }

  /**
   * In order to determine if the cell is alive or death
   * we should check the near 8 cells.
   * This function makes the efect that the panel is a TOROID.
   * So the axis and vertex are connected
   *
   * @param cell the cell that we are looking
   * @param x his col position
   * @param y his row position
   */
  checkCell(cell: Cell, x: number, y: number): void {
    let xprima: number;
    let yprima: number;
    let countAlive: number = 0;

    // check suroundig cells as if the panel was a toroid
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0) {
          // nothing. if i = 0 and j = 0 means that x=j and y=i so is the current cell
        } else {
          // toroid for columns
          if (j < 0) {
            xprima = x + j < 0 ? this.cols - 1 : x + j;
          } else {
            xprima = x + j > this.cols - 1 ? 0 : x + j;
          }

          // toroid for rows
          if (i < 0) {
            yprima = y + i < 0 ? this.rows - 1 : y + i;
          } else {
            yprima = y + i > this.rows - 1 ? 0 : y + i;
          }

          if (this.panel[yprima][xprima].status) {
            countAlive++;
          }
        }
      }
    }

    if (this.panel[y][x].status) {
      // is alive
      if (countAlive === 2 || countAlive === 3) {
        cell.reviveInNextStep();
      } else {
        cell.deadInNextStep();
      }
    } else {
      // is death
      if (countAlive == 3) cell.reviveInNextStep();
    }
  }

  /**
   * Given a draw and a position print it on the panel
   * @param draw
   * @param x position (col)
   * @param y position (row)
   */
  printDraw(draw: Drawing, x: number, y: number): void {
    const rows: number = draw.drowPanel.length;
    const cols: number = draw.drowPanel[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let xprima = x + j;
        let yprima = y + i;
        yprima = yprima > this.rows - 1 ? 0 : yprima;
        xprima = xprima > this.cols - 1 ? 0 : xprima;
        this.panel[yprima][xprima].status = draw.drowPanel[i][j].status;
        if (draw.drowPanel[i][j].status) this.population++;
      }
    }
  }
}
