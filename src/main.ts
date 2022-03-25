import { Renderer } from './render/Renderer'
import { vec3 } from 'gl-matrix'
import { Projection } from './render/components/Projection'
import { radians } from './utils/math'
import { Cube } from './object/cube'
import { Camera } from './object/Camera'
import { Light } from './object/Light'
import { Texture } from './render/components/Texture'
import wall from './resources/img/wall.jpg'

class Game extends Renderer {
  width = 800
  height = 600
  protected async init(gl: WebGL2RenderingContext) {
    const cube = new Cube([1, 1, 1], gl)
    const cube2 = new Cube([0.5, 0.5, 1], gl)
    cube2.setColor([1, 0, 0, 1])
    cube2.translate(1, 0, 1)
    cube2.rotate(radians(45), 1, 0, 0)
    const proj = new Projection(radians(60), this.width / this.height, 1 / 256, 256)
    const cam = new Camera(vec3.fromValues(2, 2, 2))
    const light = new Light(
      {
        color: [1, 1, 1, 1],
        pos: [2, 2, 2]
      },
      gl
    )
    const tex = new Texture({ src: wall, filter: gl.LINEAR }, gl)
    cube.addTexture(tex)
    await light.setup()
    await cube.setup()
    await cube2.setup()
    cam.lookAt(cube.pos())

    let angle = 90
    const len = 2
    this.drawCall(() => {
      angle += 0.05
      cube.rotateY(radians(1))
      cube2.rotateY(radians(1))
      light.position(len * Math.sin(angle), 1, len * Math.cos(angle))
      cam.lookAt(cube.pos())
      light.draw(light, cam, proj)
      cube.draw(light, cam, proj)
      cube2.draw(light, cam, proj)
    })
  }
}

const game = new Game(document.querySelector('canvas')!)

game.render()
