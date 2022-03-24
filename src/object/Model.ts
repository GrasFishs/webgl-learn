import { mat4, vec3, vec4 } from 'gl-matrix'

export abstract class Model {
  protected m = mat4.create()

  public pos() {
    return vec3.fromValues(this.m[12], this.m[13], this.m[14])
  }

  public position(x: number, y: number, z: number) {
    this.m[12] = x
    this.m[13] = y
    this.m[14] = z
  }

  public translate(x: number, y: number, z: number) {
    mat4.translate(this.m, this.m, vec3.fromValues(x, y, z))
  }

  public translateX(x: number) {
    mat4.translate(this.m, this.m, vec3.fromValues(x, 0, 0))
  }

  public translateY(y: number) {
    mat4.translate(this.m, this.m, vec3.fromValues(0, y, 0))
  }

  public translateZ(z: number) {
    mat4.translate(this.m, this.m, vec3.fromValues(0, 0, z))
  }

  public rotate(rad: number, xAxis: number = 0, yAxis: number = 0, zAxis: number = 0) {
    mat4.rotate(this.m, this.m, rad, vec3.fromValues(xAxis, yAxis, zAxis))
  }

  public rotateX(rad: number) {
    mat4.rotateX(this.m, this.m, rad)
  }

  public rotateY(rad: number) {
    mat4.rotateY(this.m, this.m, rad)
  }

  public rotateZ(rad: number) {
    mat4.rotateZ(this.m, this.m, rad)
  }

  public get() {
    return this.m
  }
}
