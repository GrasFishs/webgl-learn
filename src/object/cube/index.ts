import { Shader } from '../../render/components/Shader'
import vStr from './vetex.obj?raw'
import sStr from './shader.shader?raw'
import { vec3, vec4 } from 'gl-matrix'
import { Mesh } from '../Mesh'

// z越大越靠前
// 下，前，右，后，左，上
// pos.xyz, normal.xyz, tex.st
const data = vStr
  .replace(/[\n\s]/g, '')
  .split(',')
  .map((v) => Number(v))

const faces = data.length / (8 * 4)

const indexes = new Int16Array(
  Array.from({ length: faces })
    .map((_, i) => [0, 1, 2, 2, 3, 0].map((n) => n + i * 4))
    .flat()
)

function resizeData(size: vec3) {
  const d = data.slice()
  const x = size[0] / 2
  const y = size[1] / 2
  const z = size[2] / 2
  for (let i = 0; i < d.length; i += 8) {
    d[i] = d[i] < 0 ? -x : x
    d[i + 1] = d[i + 1] < 0 ? -y : y
    d[i + 2] = d[i + 2] < 0 ? -z : z
  }
  console.log(x, y, z)
  console.log(d)
  return new Float32Array(d)
}

export class Cube extends Mesh {
  protected color: vec4 = vec4.create()

  constructor(size: vec3, gl: WebGL2RenderingContext) {
    super(
      {
        data: resizeData(size),
        indexes,
        shader: new Shader(sStr, gl)
      },
      gl
    )
  }

  public setColor(color: vec4) {
    this.color = color
  }

  public getColor() {
    return this.color
  }

  protected doDraw(): void {
    this.shader.setUniform4f('u_Color', this.color[0], this.color[1], this.color[2], this.color[3])
  }
}
