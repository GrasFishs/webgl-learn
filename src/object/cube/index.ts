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
import { mat4, vec4 } from 'gl-matrix'

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
  protected vb: VertexBuffer
  protected ib: IndexBuffer
  protected va: VertexArray
  protected shader: Shader
  protected color: vec4 = vec4.create()

  public setColor(color: vec4) {
    this.color = color
  }

  public getColor() {
    return this.color
  }

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
  }

  public draw(light: Light, camera: Camera, proj: Projection) {
    this.shader.bind()
    this.shader.setUniform4f('u_Color', this.color[0], this.color[1], this.color[2], this.color[3])
    this.shader.setUniformMatrix4fv('v', camera.get())
    this.shader.setUniformMatrix4fv('p', proj.get())
    this.shader.setUniformMatrix4fv('m', this.get())
    const t = mat4.transpose(mat4.create(), mat4.invert(mat4.create(), this.get()))
    this.shader.setUniformMatrix4fv('u_normalMatrix', t)

    this.shader.setUniform3f('u_lightPos', light.pos())
    this.shader.setUniform4f('u_lightColor', light.getColor())
    this.shader.bind()
    this.ib.draw()
  }
}
