import { vec3, mat4 } from 'gl-matrix'

export class Camera {
  private position = vec3.create()
  private front = vec3.create()
  private up = vec3.create()
  private view = mat4.create()

  public constructor(pos: vec3) {
    this.setPosition(pos[0], pos[1], pos[2])
    vec3.set(this.front, 0, 0, -1)
    vec3.set(this.up, 0, 1, 0)
  }

  public setPosition(x: number | vec3, y: number, z: number) {
    if (typeof x === 'number') {
      vec3.set(this.position, x, y, z)
    } else {
      vec3.copy(this.position, x)
    }
  }

  public getView() {
    return mat4.lookAt(
      this.view,
      this.position,
      vec3.add(vec3.create(), this.position, this.front),
      this.up
    )
  }
}
