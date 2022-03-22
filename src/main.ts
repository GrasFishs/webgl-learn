import { Shader } from './render/components/Shader'
import { Renderer } from './render/Renderer'
import shaderRaw from './color.shader?raw'
import huaji from './huaji.png'
import { VertexBuffer } from './render/components/VertexBuffer'
import { VertexArray } from './render/components/VertexArray'
import { Texture } from './render/components/Texture'
import { IndexBuffer } from './render/components/IndexBuffer'

class Game extends Renderer {
  protected async init(gl: WebGL2RenderingContext) {
    const shader = new Shader(shaderRaw, gl)
    // eslint-disable-next-line
    const vb = new VertexBuffer(new Float32Array([
      -0.5, -0.5, 1.0, 0, 0,
      0.5, -0.5, 1.0, 1, 0,
      0.5, 0.5, 1.0, 1, 1,
      -0.5, 0.5, 1.0, 0, 1
    ]), gl)
    // eslint-disable-next-line
    const ib = new IndexBuffer(new Int16Array([
      0, 1, 2,
      2, 3, 0
    ]), gl)
    const va = new VertexArray(shader, gl)
    const tex = new Texture(gl)
    await tex.load(huaji)
    tex.bind(0)
    shader.setUniform1i('u_Texture', 0)
    va.add('pos', 3, gl.FLOAT)
    va.add('coord', 2, gl.FLOAT)
    va.bind(vb)
    shader.setUniform4f('u_Color', 1, 0, 0, 1)
    this.drawCall(() => {
      ib.draw()
    })
  }
}

const game = new Game()

game.render()
