import { Renderer } from './render/Renderer'
import { vec3 } from 'gl-matrix'
import { Projection } from './render/components/Projection'
import { radians } from './utils/math'
import { Cube } from './object/cube'
import { Camera } from './object/Camera'
import { Light } from './object/Light'

class Game extends Renderer {
  width = 800
  height = 600
  protected async init(gl: WebGL2RenderingContext) {
    const cube = new Cube(gl)
    const proj = new Projection(radians(45), this.width / this.height, 1 / 256, 256)
    const cam = new Camera(vec3.fromValues(2, 2, 2))
    const light = new Light({
      color: [1, 1, 1, 1],
      pos: [1, 1, 1]
    })
    let angle = 90
    const len = 2
    this.drawCall(() => {
      angle += 0.01
      cam.position(len * Math.sin(angle), 2, len * Math.cos(angle))
      cam.lookAt(cube.pos())
      cube.draw(light, cam, proj)
    })
  }
}

const game = new Game(document.querySelector('canvas')!)

game.render()
