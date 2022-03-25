import { vec3, vec4 } from 'gl-matrix'
import { Cube } from './cube'

export class Light extends Cube {
  constructor({ color, pos }: { color: vec4; pos: vec3 }, gl: WebGL2RenderingContext) {
    super(gl)
    this.color = color
    this.translate(pos[0], pos[1], pos[2])
    this.scale(0.1, 0.1, 0.1)
  }

  protected async doSetup() {
    this.shader.setUniform1i('u_light', 1)
  }
}
