import { mat4 } from 'gl-matrix'
import { IndexBuffer } from '../render/components/IndexBuffer'
import { Projection } from '../render/components/Projection'
import { Shader } from '../render/components/Shader'
import { Texture } from '../render/components/Texture'
import { VertexArray } from '../render/components/VertexArray'
import { VertexBuffer } from '../render/components/VertexBuffer'
import { Camera } from './Camera'
import { Light } from './Light'
import { Model } from './Model'

type MeshParam = {
  data: Float32Array
  indexes: Int16Array
  shader: Shader
}

export abstract class Mesh extends Model {
  protected vb: VertexBuffer
  protected ib: IndexBuffer
  protected va: VertexArray
  protected shader: Shader
  protected textures: Texture[] = []
  protected data: Float32Array
  protected indexes: Int16Array

  constructor(param: MeshParam, gl: WebGL2RenderingContext) {
    super()
    this.data = param.data
    this.indexes = param.indexes
    this.shader = param.shader
    this.vb = new VertexBuffer(this.data, this.data.length / 32, gl)
    this.ib = new IndexBuffer(this.indexes, gl)
    this.va = new VertexArray(this.shader, gl)
    this.va.add('Position', 3, gl.FLOAT)
    this.va.add('Normal', 3, gl.FLOAT)
    this.va.add('Coord', 2, gl.FLOAT)
    this.va.bind(this.vb)
  }

  public addTexture(tex: Texture) {
    this.textures.push(tex)
  }

  protected doSetup(): Promise<unknown> {
    return Promise.resolve()
  }

  public async setup() {
    this.shader.bind()
    await this.doSetup()
    if (this.textures.length > 0) {
      this.shader.setUniform1i('u_useTexture', 1)
    }
    return Promise.all(
      this.textures.map((tex, i) => {
        tex.bind(i)
        this.shader.setUniform1i(`u_Texture${i}`, i)
        return tex.setup()
      })
    )
  }

  protected abstract doDraw(): void

  public draw(light: Light, camera: Camera, proj: Projection) {
    this.shader.bind()
    this.va.bind(this.vb)
    this.doDraw()
    this.shader.setUniformMatrix4fv('v', camera.get())
    this.shader.setUniformMatrix4fv('p', proj.get())
    this.shader.setUniformMatrix4fv('m', this.get())
    const t = mat4.transpose(mat4.create(), mat4.invert(mat4.create(), this.get()))
    this.shader.setUniformMatrix4fv('u_normalMatrix', t)

    this.shader.setUniform3f('u_cameraPos', camera.pos())
    this.shader.setUniform3f('u_lightPos', light.pos())
    this.shader.setUniform4f('u_lightColor', light.getColor())
    this.ib.draw()
  }
}
