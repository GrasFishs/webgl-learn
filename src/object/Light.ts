import { vec3, vec4 } from 'gl-matrix'
import { Model } from './Model'

export class Light extends Model {
  private color: vec4
  constructor({ color, pos }: { color: vec4; pos: vec3 }) {
    super()
    this.color = color
    this.translate(pos[0], pos[1], pos[2])
  }

  public setColor(color: vec4) {
    this.color = color
  }

  public getColor() {
    return this.color
  }
}
