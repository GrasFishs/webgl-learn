import { Shader } from './render/components/Shader'
import { Renderer } from './render/Renderer'
import shaderRaw from './resources/shader/color.shader?raw'
import huaji from './resources/img/huaji.png'
import wall from './resources/img/wall.jpg'
import block from './resources/model/block.obj?raw'
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
      block
        .replace(/[\n\s]/g, '')
        .split(',')
        .map((v) => Number(v))
    )
    const vb = new VertexBuffer(data, data.length / 5, gl)
    const ib = new IndexBuffer(new Int16Array([0, 1, 2, 2, 3, 0]), gl)
    const va = new VertexArray(shader, gl)
    va.add('pos', 3, gl.FLOAT)
    va.add('coord', 2, gl.FLOAT)
    va.bind(vb)
    const tex = new Texture(gl)
    const tex2 = new Texture(gl)
    await tex.load(huaji)
    await tex2.load(wall)
    tex.bind(0)
    shader.setUniform1i('u_Texture', 0)
    tex2.bind(1)
    shader.setUniform1i('u_Texture2', 1)

    const cam = new Camera(vec3.fromValues(0, 0, 3))
    const [proj, model] = [mat4.create(), mat4.create(), mat4.create()]
    // mat4.ortho(proj, -2, 2, -15, 1.5, -1, 1)
    mat4.perspective(proj, Math.PI / 4, this.width / this.height, 1 / 256, 256)
    shader.setUniform4f('u_Color', 0.2, 0, 0, 1)
    shader.setUniformMatrix4fv('u_proj', proj)
    shader.setUniformMatrix4fv('u_view', cam.getView())
    const radians = (Math.PI / 180) * 45
    mat4.rotate(model, model, radians, vec3.fromValues(1, 1, 0))
    shader.setUniformMatrix4fv('u_model', model)
    this.drawCall(() => {
      vb.draw()
    })
  }
}

const game = new Game(document.querySelector('canvas')!)

game.render()
