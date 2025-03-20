import { ExtendedObject3D } from "../utils/ExtendedObject3D";
import { Card } from "./Card";

export class Grid extends ExtendedObject3D {
  static COLUMNS = Math.floor(window.innerWidth / 100) | 1;
  static ROWS = Math.floor(window.innerHeight / 100) | 1;

  constructor() {
    super();

    Card.SetScale();
    this.#_createCards();
  }

  #_createCards() {
    for (let i = 0; i < Grid.COLUMNS; i++) {
      for (let j = 0; j < Grid.ROWS; j++) {
        const card = new Card(i, j);
        this.add(card);
      }
    }
  }

  resize() {
    Grid.COLUMNS = Math.floor(window.innerWidth / 100) | 1;
    Grid.ROWS = Math.floor(window.innerHeight / 100) | 1;

    Card.SetScale();
  }

  update(dt) {}
}
