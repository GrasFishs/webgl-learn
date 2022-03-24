import { vec3, mat4 } from 'gl-matrix'
import { Model } from './Model'

export class Camera extends Model {
  private front = vec3.create()
  private up = vec3.create()
  private view = mat4.create()

  public constructor(pos: vec3) {
    super()
    this.translate(pos[0], pos[1], pos[2])
    vec3.set(this.front, 0, 0, -1)
    vec3.set(this.up, 0, 1, 0)
    this.change()
  }

  private change() {
    const pos = this.pos()
    mat4.lookAt(this.view, pos, vec3.add(vec3.create(), pos, this.front), this.up)
  }

  public lookAt(target: vec3) {
    mat4.lookAt(this.view, this.pos(), target, this.up)
  }

  public get() {
    return this.view
  }
}
