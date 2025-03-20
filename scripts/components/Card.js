import { Color, Mesh, MeshBasicMaterial, PlaneGeometry, Vector2 } from "three";
import { ExtendedObject3D } from "../utils/ExtendedObject3D";

export class Card extends ExtendedObject3D {
  static Geometry = new PlaneGeometry(1, 1);

  gridPosition = new Vector2();
  mesh;

  constructor(i, j) {
    super();

    this.gridPosition.set(i, j);
    this.#_createMesh();
  }

  #_createMesh() {
    const r = Math.ceil(Math.random() * 255);
    const g = Math.ceil(Math.random() * 255);
    const b = Math.ceil(Math.random() * 255);

    this.mesh = new Mesh(
      Card.Geometry,
      new MeshBasicMaterial({ color: new Color(`rgb(${r}, ${g}, ${b})`) })
    );

    this.add(this.mesh);
  }

  resize(event) {}

  update(dt) {}
}
