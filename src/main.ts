import { Shader } from './render/components/Shader'
import { Renderer } from './render/Renderer'
import shaderRaw from './resources/shader/color.shader?raw'
import chest from './resources/model/chest.obj?raw'
import chestTex from './resources/img/chest.png'
import { VertexBuffer } from './render/components/VertexBuffer'
import { VertexArray } from './render/components/VertexArray'
import { Texture } from './render/components/Texture'
import { IndexBuffer } from './render/components/IndexBuffer'
import { mat4, vec2, vec3 } from 'gl-matrix'
import { Camera } from './render/components/Camera'

class Game extends Renderer {
  width = 800
  height = 600
  protected async init(gl: WebGL2RenderingContext) {
    const shader = new Shader(shaderRaw, gl)
    const data = new Float32Array(
      chest
        .replace(/[\n\s]/g, '')
        .split(',')
        .map((v) => Number(v))
    )
    const vb = new VertexBuffer(data, data.length / 5, gl)
    const faces = data.length / (5 * 4)
    const indexes = Array.from({ length: faces })
      .map((_, i) => [0, 1, 2, 2, 3, 0].map((n) => n + i * 4))
      .flat()
    const ib = new IndexBuffer(new Int16Array(indexes), gl)
    const va = new VertexArray(shader, gl)
    va.add('pos', 3, gl.FLOAT)
    va.add('coord', 2, gl.FLOAT)
    va.bind(vb)
    const tex = new Texture(gl)
    await tex.load(chestTex, gl.NEAREST)
    tex.bind(0)
    shader.setUniform1i('u_Texture', 0)

    const cam = new Camera(vec3.fromValues(0, 0, 3))
    const [proj, model] = [mat4.create(), mat4.create(), mat4.create()]
    // mat4.ortho(proj, -2, 2, -15, 1.5, -1, 1)
    mat4.perspective(proj, Math.PI / 4, this.width / this.height, 1 / 256, 256)
    shader.setUniform4f('u_Color', 0.2, 0, 0, 1)
    shader.setUniformMatrix4fv('u_proj', proj)
    shader.setUniformMatrix4fv('u_view', cam.getView())
    shader.setUniformMatrix4fv('u_model', model)
    this.drawCall(() => {
      const radians = (Math.PI / 180) * 1
      mat4.rotate(model, model, radians, vec3.fromValues(1, 1, 1))
      shader.setUniformMatrix4fv('u_model', model)
      ib.draw()
    })
  }
}

const game = new Game(document.querySelector('canvas')!)

game.render()
