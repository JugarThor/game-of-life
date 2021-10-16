import { Component } from '@angular/core';
import { Cell } from '@models/cell.model';
import { GameOfLife } from '@models/game-of-life-model';
import { Drawing, DrawingObject } from '@models/drawing.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public playMode: boolean = false;
  public editMode: boolean = true;
  public gof: GameOfLife = new GameOfLife(100, 50); // Game Of Life

  public intervalVelocity: number = 100;

  public errors: boolean = false;
  public stringError: string;

  public selectedDraw: Drawing;

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
      this.selectedDraw = null;
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

  selectDraw(draw: Drawing) {
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
