import { Shader } from '../../render/components/Shader'
import vStr from './vetex.obj?raw'
import sStr from './shader.shader?raw'
import { vec4 } from 'gl-matrix'
import { Mesh } from '../Mesh'

// z越大越靠前
// 下，前，右，后，左，上
// pos.xyz, normal.xyz, tex.st
const data = new Float32Array(
  vStr
    .replace(/[\n\s]/g, '')
    .split(',')
    .map((v) => Number(v))
)

const faces = data.length / (8 * 4)

const indexes = new Int16Array(
  Array.from({ length: faces })
    .map((_, i) => [0, 1, 2, 2, 3, 0].map((n) => n + i * 4))
    .flat()
)
export class Cube extends Mesh {
  protected color: vec4 = vec4.create()

  public setColor(color: vec4) {
    this.color = color
  }

  public getColor() {
    return this.color
  }

  constructor(gl: WebGL2RenderingContext) {
    super(
      {
        data,
        indexes,
        shader: new Shader(sStr, gl)
      },
      gl
    )
  }

  protected doDraw(): void {
    this.shader.setUniform4f('u_Color', this.color[0], this.color[1], this.color[2], this.color[3])
  }
}
