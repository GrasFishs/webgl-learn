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
    this.position(x, y, z)
  }

  public translateX(x: number) {
    this.position(x, this.m[13], this.m[14])
  }

  public translateY(y: number) {
    this.position(this.m[12], y, this.m[14])
  }

  public translateZ(z: number) {
    this.position(this.m[12], this.m[13], z)
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

  public scale(x: number, y: number, z: number) {
    mat4.scale(this.m, this.m, vec3.fromValues(x, y, z))
  }

  public get() {
    return this.m
  }
}
