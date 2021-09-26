import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Drawing } from '@models/drawing.model';

import {
  spaceShipRight,
  spaceShipLeft,
  spaceShipUp,
  spaceShipDown,
  miniShipDiagonalRight,
} from '@providers/drawins/drawings';

@Component({
  selector: 'app-drawing-menu',
  templateUrl: './drawing-menu.component.html',
  styleUrls: ['./drawing-menu.component.scss'],
})
export class DrawingMenuComponent implements OnInit {
  @Input() selectedDraw: Drawing;
  @Output() onSelectDraw = new EventEmitter<Drawing>();

  public availableDraws: Drawing[] = [
    new Drawing('SpaceShip-right', spaceShipRight),
    new Drawing('SpaceShip-left', spaceShipLeft),
    new Drawing('SpaceShip-up', spaceShipUp),
    new Drawing('SpaceShip-down', spaceShipDown),
    new Drawing('MinishipDiagonal-right', miniShipDiagonalRight),
  ];

  constructor() {}

  ngOnInit(): void {}

  selectDraw(draw: Drawing) {
    this.onSelectDraw.emit(draw);
  }
}
