import { vec3, vec4 } from 'gl-matrix'
import { Projection } from '../render/components/Projection'
import { Camera } from './Camera'
import { Cube } from './cube'

export class Light extends Cube {
  constructor({ color, pos }: { color: vec4; pos: vec3 }, gl: WebGL2RenderingContext) {
    super(gl)
    this.color = color
    this.translate(pos[0], pos[1], pos[2])
    this.scale(0.1, 0.1, 0.1)
  }

  public draw(light: Light, camera: Camera, proj: Projection): void {
    super.draw(light, camera, proj)
    this.shader.setUniform1i('u_light', 1)
  }
}
