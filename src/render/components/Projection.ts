import { mat4 } from 'gl-matrix'

export class Projection {
  private m: mat4 = mat4.create()

  constructor(
    private _fov: number,
    private _aspect: number,
    private _near: number,
    private _far: number
  ) {
    this.change()
  }

  private change() {
    mat4.perspective(this.m, this._fov, this._aspect, this._near, this._far)
  }

  public fov(v: number) {
    this._fov = v
    this.change()
  }

  public aspect(v: number) {
    this._aspect = v
    this.change()
  }

  public distance(near: number, far: number) {
    this._near = near
    this._far = far
    this.change()
  }

  public get() {
    return this.m
  }
}
