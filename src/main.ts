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
    const proj = new Projection(radians(60), this.width / this.height, 1 / 256, 256)
    const cam = new Camera(vec3.fromValues(3, 3, 3))
    const light = new Light(
      {
        color: [1, 1, 1, 1],
        pos: [2, 2, 2]
      },
      gl
    )
    const cube2 = new Cube(gl)
    cube2.setColor([1, 0, 0, 1])
    cube2.scale(0.5, 0.5, 0.5)
    cube2.translate(1, 0, 1)
    cube2.rotate(radians(45), 1, 0, 0)
    cam.lookAt(cube.pos())
    let angle = 90
    const len = 2
    this.drawCall(() => {
      angle += 0.01
      cube.rotateY(radians(1))
      cube2.rotateY(radians(1))
      light.position(len * Math.sin(angle), len * Math.cos(angle), len * Math.cos(angle))
      // cam.lookAt(cube.pos())
      light.draw(light, cam, proj)
      cube.draw(light, cam, proj)
      cube2.draw(light, cam, proj)
    })
  }
}

const game = new Game(document.querySelector('canvas')!)

game.render()
