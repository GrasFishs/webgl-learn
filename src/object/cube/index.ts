import { IndexBuffer } from '../../render/components/IndexBuffer'
import { VertexArray } from '../../render/components/VertexArray'
import { VertexBuffer } from '../../render/components/VertexBuffer'
import { Shader } from '../../render/components/Shader'
import { Projection } from '../../render/components/Projection'
import vStr from './vetex.obj?raw'
import sStr from './shader.shader?raw'
import { Model } from '../Model'
import { Camera } from '../Camera'
import { Light } from '../Light'

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

export class Cube extends Model {
  private vb: VertexBuffer
  private ib: IndexBuffer
  private va: VertexArray
  private shader: Shader

  constructor(gl: WebGL2RenderingContext) {
    super()
    this.vb = new VertexBuffer(data, faces, gl)
    this.ib = new IndexBuffer(indexes, gl)
    this.shader = new Shader(sStr, gl)
    this.va = new VertexArray(this.shader, gl)
    this.va.add('pos', 3, gl.FLOAT)
    this.va.add('normal', 3, gl.FLOAT)
    this.va.add('coord', 2, gl.FLOAT)
    this.va.bind(this.vb)
    this.shader.setUniform4f('u_Color', 1, 0, 0, 1)
  }

  public draw(light: Light, camera: Camera, proj: Projection) {
    this.shader.setUniformMatrix4fv('v', camera.get())
    this.shader.setUniformMatrix4fv('p', proj.get())
    this.shader.setUniformMatrix4fv('m', this.get())

    this.shader.setUniform3f('u_lightPos', light.pos())
    this.shader.setUniform4f('u_lightColor', light.getColor())
    this.shader.bind()
    this.ib.draw()
  }
}
