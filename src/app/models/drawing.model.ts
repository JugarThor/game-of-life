import { Cell } from '@models/cell.model';

// model draw object
export interface DrawingObject {
  grid: number[][];
}

// MODEL DRAW
export class Drawing {
  public name: string;
  public draw: DrawingObject;
  public drawingPanel: Cell[][];
  constructor(name: string, draw: DrawingObject) {
    this.name = name;
    this.draw = draw;
    this.build();
  }

  build(): void {
    this.drawingPanel = this.draw.grid.map((row) => {
      return row.map((cellStatus: number) => {
        return new Cell(!!cellStatus);
      });
    });
  }
}
